/* eslint-disable max-len */
/* eslint-disable import/extensions */
import {
  View,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  useWindowDimensions,
  NativeSyntheticEvent,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Page from "@shared-components/page/Page";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import dayjs from "dayjs";
import Box from "@shared-components/box/Box";
import Badge from "@shared-components/button/Badge";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { capitalizeFirstLetter, storage, to2DecimalPlaces } from "@utils";
import { palette } from "@theme/themes";
import {
  IBaseScreenProps,
  RootStackParamList,
  SCREENS,
} from "@shared-constants";
import CustomButton from "@shared-components/button/Button";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import RNBounceable from "@freakycoder/react-native-bounceable";
import useBoundStore from "store";
import { SavingPlan, User } from "@services/models";
import Loader from "@shared-components/loading/Loading";
import { forkJoin, from, map } from "rxjs";
import riseApi from "@api";

interface HomeProps extends IBaseScreenProps<"Home"> {}

interface IBalance {
  balance: number;
  change: number;
  currency: string;
  label: string;
}

const IMAGES = [
  require("@assets/images/coins.jpeg"),
  require("@assets/images/cart.jpeg"),
  require("@assets/images/rings.jpeg"),
];

const Dot: React.FC<{
  index: number;

  isFinal: boolean;
  active: number;
}> = ({ index, isFinal, active }) => {
  return (
    <View
      style={[
        Styles.indicator,
        {
          width: active === index ? 15 : 8,
          height: 8,
          backgroundColor: active === index ? palette.primary : "#71879C33",
          marginRight: isFinal ? 0 : 14,
        },
      ]}
    />
  );
};

const Indicator: React.FC<{
  data: any[];
  currentPage: number;
}> = ({ data, currentPage }) => {
  return (
    <Box style={[{ position: "relative" }]}>
      <Box style={Styles.indicatorView}>
        {data.map((_, index) => {
          return (
            <Dot
              key={`indicator-${index}`}
              index={index}
              active={currentPage}
              isFinal={index === data.length - 1}
            />
          );
        })}
      </Box>
    </Box>
  );
};

const HeaderComponent: React.FC<{
  notificationCount: number;
  theme: any;
  user: User | null;
}> = ({ theme, notificationCount, user }) => {
  const now = dayjs();
  const hour = now.hour();
  let message = "Good morning ☀️";
  if (hour > 16) {
    message = "Good Evening 🌙";
  } else if (hour >= 12) {
    message = "Good Afternoon ☀️";
  }
  return (
    <Box flexDirection="row" alignItems="center" margin={[10, 0]}>
      <Box flex={1}>
        <TextWrapper fontSize={15}>{message}</TextWrapper>
        <TextWrapper fontSize={20}>
          {capitalizeFirstLetter(user?.first_name || "")}
        </TextWrapper>
      </Box>
      <Box>
        <Badge
          label="Earn 3% bonus"
          textSize={12}
          style={{ paddingHorizontal: 8, paddingVertical: 8, borderRadius: 16 }}
        />
      </Box>
      <Box style={{ position: "relative" }} padding={[0, 0, 0, 11]}>
        <Icon
          name="bell"
          type={IconType.MaterialCommunityIcons}
          color={theme.colors.primary}
          size={30}
        />
        {notificationCount > 0 && (
          <Badge
            style={{
              position: "absolute",
              top: -32,
              right: 0,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            backgroundColor={theme.colors.red}
          >
            <TextWrapper
              fontSize={10}
              fontWeight="600"
              color={theme.colors.white}
            >{`${
              notificationCount > 9 ? "9+" : notificationCount
            }`}</TextWrapper>
          </Badge>
        )}
      </Box>
    </Box>
  );
};

const BalanceItem: React.FC<{
  balanceItem: IBalance;
  theme: any;
  moveForward: () => void;
  show: boolean;
  showNext: boolean;
  setShow: (b: boolean) => void;
}> = ({ balanceItem, theme, showNext, moveForward, show, setShow }) => {
  const { balance, currency, change } = balanceItem;

  const isGain = change >= 0;
  return (
    <Box alignItems="center">
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={{ marginBottom: 12 }}
      >
        <Box flexDirection="row" alignItems="center">
          <TextWrapper fontSize={15}>{balanceItem.label}</TextWrapper>
          <Icon
            name={show ? "eye-off" : "eye"}
            type={IconType.MaterialCommunityIcons}
            color={theme.colors.primary}
            size={13}
            style={{ marginLeft: 4 }}
          />
        </Box>
      </TouchableOpacity>

      <TextWrapper fontSize={32} style={Styles.mb12}>
        {currency}
        {show ? to2DecimalPlaces(balance) : "*****"}
      </TextWrapper>
      <View
        style={[
          { height: 1, width: 200, backgroundColor: "#71879C1A" },
          Styles.mb12,
        ]}
      />
      <Box flexDirection="row" alignItems="center">
        <TextWrapper>Total Gains</TextWrapper>
        <Icon
          style={{ marginHorizontal: 5 }}
          name={isGain ? "arrow-up-right" : "arrow-down-right"}
          color={isGain ? theme.colors.green : theme.colors.red}
          type={IconType.Feather}
          size={16}
        />
        <TextWrapper
          color={isGain ? theme.colors.green : theme.colors.red}
          fontSize={16}
        >
          {to2DecimalPlaces(change)}%
        </TextWrapper>
        {showNext && (
          <Icon
            name="chevron-right"
            type={IconType.Feather}
            color="#71879C"
            size={16}
            onPress={() => moveForward()}
          />
        )}
      </Box>
    </Box>
  );
};

const CreatePlan: React.FC<{ theme: any; onClose: () => void }> = ({
  theme,
  onClose,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const data = [
    {
      icon: (
        <TextWrapper fontSize={15} color={theme.colors.primary}>
          ?
        </TextWrapper>
      ),
      label: "Give us a few details",
      description:
        "Tell us what you want to achieve and we will help you get there",
    },
    {
      icon: (
        <Icon
          name="calendar-month"
          type={IconType.MaterialCommunityIcons}
          color={theme.colors.primary}
        />
      ),
      label: "Turn on auto-invest",
      description:
        "The easiest way to get your investment working for you is to fund to periodically.",
    },
    {
      icon: (
        <Icon
          name="settings"
          type={IconType.Feather}
          color={theme.colors.primary}
        />
      ),
      label: "Modify as you progress",
      description:
        "You are in charge. Make changes to your plan, from adding funds, funding source, adding money to your wallet and more.",
    },
  ];
  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: top,
        backgroundColor: theme.colors.background,
      }}
    >
      <Page
        navigationComponent={
          <TouchableOpacity onPress={() => onClose()}>
            <Box flexDirection="row">
              <Box
                backgroundColor="#71879C1A"
                width={40}
                height={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
              >
                <Icon
                  name="x"
                  type={IconType.Feather}
                  color={theme.colors.primary}
                />
              </Box>
            </Box>
          </TouchableOpacity>
        }
        label="Create a plan"
      >
        <ScrollView style={{ flex: 1 }}>
          <Box padding={[0, 20]}>
            <Box margin={[40, 0]}>
              <TextWrapper fontSize={15} textAlign="center">
                Reach your goals faster
              </TextWrapper>
            </Box>
            <Box alignItems="center">
              <Image
                source={require("@assets/images/cart.jpeg")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            </Box>

            <Box>
              {data.map((d, i) => (
                <Box flexDirection="row" key={`info-${i}`} margin={[20, 0]}>
                  <Box
                    width={24}
                    height={24}
                    borderRadius={15}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={theme.colors.offWhite}
                    marginRight={20}
                  >
                    {d.icon}
                  </Box>
                  <Box flex={1}>
                    <TextWrapper
                      fontWeight="700"
                      color={theme.colors.textBlack}
                    >
                      {d.label}
                    </TextWrapper>

                    <TextWrapper style={{ marginTop: 6 }}>
                      {d.description}
                    </TextWrapper>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </ScrollView>
        <Box margin={[30, 0]} padding={[0, 20]}>
          <CustomButton
            label="Continue"
            onPress={() => {
              onClose();
              navigation.navigate(SCREENS.CREATE_GOAL_NAME);
            }}
          />
        </Box>
      </Page>
    </SafeAreaView>
  );
};

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const theme = useTheme();
  const [showBalance, setShowBalance] = useState(true);
  const [show, setShow] = useState(false);
  const [todayQuote, setTodayQuote] = useState<
    { quote: string; author: string } | undefined
  >();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState<IBalance[]>([]);
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const flatListRef = useRef<FlatList>();
  const { width } = useWindowDimensions();
  const { user, setUser } = useBoundStore();
  const recordScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    setCurrentPage(indexOfNextScreen);
  };

  const refresh = () => {
    setRefreshing(true);
    const response$ = forkJoin({
      session: riseApi.session({}, {}),
      plans: riseApi.getPlans({}, {}),
    }).pipe(
      map((d) => {
        if (d.plans.code !== 200 && d.plans.code !== 201) {
          setRefreshing(false);
          throw new Error(d.plans.errorData?.message || "failed to load plans");
        } else if (d.session.code !== 200 && d.session.code !== 201) {
          setRefreshing(false);
          throw new Error(
            d.session.errorData?.message || "failed to load session",
          );
        }
        return d;
      }),
    );
    response$.subscribe({
      next: ({ plans, session }) => {
        setPlans(plans.data!.items);
        setUser(session.data!);
      },
      complete: () => {
        setRefreshing(false);
      },
      error: (e) => {
        setRefreshing(false);
        Alert.alert("Error", e.message);
      },
    });
  };
  const toggleBalance = (showBal: boolean) => {
    storage.set("app.show_balance", showBal);
    setShowBalance(showBal);
  };

  useEffect(() => {
    const showBal = storage.getBoolean("app.show_balance");
    if (showBal !== undefined) {
      setShowBalance(showBal);
    }
    setLoading(true);
    const response$ = from(riseApi.getPlans({}, {}));
    response$.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
          setPlans(res.data!.items);
        } else {
          Alert.alert(
            "Error",
            res.errorData?.message || "Something went wrong",
          );
        }
      },
      complete: () => {
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    const response$ = from(riseApi.getQuote({}, {}));
    response$.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
          setTodayQuote(res.data);
        } else {
          Alert.alert(
            "Error",
            res.errorData?.message || "Something went wrong",
          );
        }
      },
    });
  }, []);
  useEffect(() => {
    const _balances: IBalance[] = [
      {
        balance: (user as any)?.total_balance || 0,
        change: 0,
        currency: "$",
        label: "Total Balance",
      },
    ].concat(
      plans.slice(3).map((p) => ({
        balance: p.total_returns,
        change: p.total_returns / p.target_amount,
        currency: "$",
        label: p.plan_name,
      })),
    );
    setBalances(_balances);
  }, [plans, user]);
  const scroll = () => {
    if (currentPage === balances.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
      setCurrentPage(0);
      return;
    }
    flatListRef.current?.scrollToIndex({
      index: currentPage + 1,
      animated: true,
    });
  };
  const renderBalance = ({ item }: { item: IBalance }) => (
    <Box width={width - 40}>
      <BalanceItem
        theme={theme}
        balanceItem={item}
        showNext
        moveForward={scroll}
        show={showBalance}
        setShow={toggleBalance}
      />
    </Box>
  );

  const close = () => {
    setShow(false);
  };

  const renderPlans = () => {
    if (!hasPlans) {
      return <View />;
    }
    return (
      <Box flexDirection="row">
        {plans.map((p, i) => (
          <TouchableOpacity
            key={`plan-${i}`}
            onPress={() => {
              navigation.navigate(SCREENS.VIEW_GOAL_PLAN, { goal: p });
            }}
          >
            <Box
              imageBackground
              source={IMAGES[i % IMAGES.length]}
              margin={[0, 0, 0, 20]}
              borderRadius={12}
              width={188}
              height={243}
              backgroundColor={theme.colors.primary}
              justifyContent="flex-end"
            >
              <Box padding={16} width={"100%"}>
                <TextWrapper color={theme.colors.white} fontSize={15}>
                  {p.plan_name}
                </TextWrapper>
                <TextWrapper color={theme.colors.white} fontSize={15}>
                  ${to2DecimalPlaces(p.invested_amount)}
                </TextWrapper>
                <TextWrapper color={theme.colors.white} fontSize={15}>
                  Mixed Assets
                </TextWrapper>
              </Box>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    );
  };
  const hasPlans = plans.length > 0;
  return (
    <Page>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Box padding={[0, 20]}>
          <HeaderComponent
            notificationCount={100}
            user={user as User}
            theme={theme}
          />

          <Box
            backgroundColor={theme.colors.background}
            style={{ borderColor: theme.colors.white }}
            marginBottom={12}
            marginTop={12}
          >
            <FlatList
              data={balances}
              keyExtractor={(_, index) => `balance-item${index}`}
              renderItem={renderBalance}
              scrollEventThrottle={16}
              onScroll={recordScroll}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              ref={flatListRef as any}
            />
          </Box>
          <Indicator currentPage={currentPage} data={balances} />
          <RNBounceable>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              borderRadius={5}
              borderColor={"#71879C33"}
              borderWidth={1}
              padding={[16, 0]}
              margin={[20, 0]}
            >
              <Icon
                name="plus"
                type={IconType.Feather}
                color={theme.colors.primary}
                size={21}
                style={{ marginRight: 10 }}
              />
              <TextWrapper
                fontWeight="500"
                color={theme.colors.primary}
                fontSize={21}
              >
                Add money
              </TextWrapper>
            </Box>
          </RNBounceable>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TextWrapper
              fontWeight="500"
              fontSize={18}
              color={theme.colors.textBlack}
            >
              Create Plan
            </TextWrapper>
            <TouchableOpacity onPress={() => {}}>
              <TextWrapper
                color={hasPlans ? theme.colors.primary : "#94A1AD"}
                fontWeight="700"
              >
                View all plans
              </TextWrapper>
            </TouchableOpacity>
          </Box>
        </Box>
        <Box margin={[15, 0, 30]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setShow(true)}>
              <Box
                width={188}
                height={243}
                backgroundColor={theme.colors.offWhite}
                justifyContent="center"
                alignItems="center"
                borderRadius={12}
                margin={[0, 0, 0, 20]}
              >
                <Box
                  backgroundColor="#40BBC326"
                  width={42}
                  height={42}
                  marginBottom={12}
                  justifyContent="center"
                  alignItems="center"
                  borderRadius={21}
                >
                  <Icon
                    name="plus"
                    type={IconType.Feather}
                    color={theme.colors.primary}
                    size={25}
                  />
                </Box>
                <TextWrapper
                  color={theme.colors.textBlack}
                  fontWeight="700"
                  style={{ width: 120 }}
                  textAlign="center"
                >
                  Create an investment plan
                </TextWrapper>
              </Box>
            </TouchableOpacity>
            {renderPlans()}
          </ScrollView>
        </Box>
        <Box padding={[0, 20]}>
          <Box
            backgroundColor={theme.colors.background}
            flexDirection="row"
            padding={[10, 0]}
            marginBottom={12}
            alignItems="center"
            style={{
              shadowColor: "rgba(53, 71, 89, 0.15)",
              shadowOffset: {
                width: 2,
                height: 1,
              },
              shadowRadius: 4,
              shadowOpacity: 1,
            }}
          >
            <Box
              width={24}
              height={24}
              borderRadius={15}
              alignItems="center"
              justifyContent="center"
              backgroundColor={theme.colors.offWhite}
              marginRight={10}
            >
              <TextWrapper fontSize={15} color={theme.colors.primary}>
                ?
              </TextWrapper>
            </Box>
            <TextWrapper
              style={{ flex: 1 }}
              color={theme.colors.textBlack}
              fontSize={15}
            >
              Need Help?
            </TextWrapper>
            <Badge
              label="Contact us"
              textSize={15}
              style={{ paddingHorizontal: 20, paddingVertical: 11 }}
            />
          </Box>

          <Box
            backgroundColor={theme.colors.primary}
            padding={20}
            borderRadius={15}
          >
            {!todayQuote && (
              <ActivityIndicator color={theme.colors.white} size="small" />
            )}
            {!!todayQuote && (
              <Box>
                <TextWrapper fontWeight="700" color={theme.colors.white}>
                  TODAY’S QUOTE
                </TextWrapper>
                <Box margin={[20, 0]}>
                  <View
                    style={{ height: 2, width: 28, backgroundColor: "#FFFFFF" }}
                  />
                </Box>
                <TextWrapper fontSize={15} color={theme.colors.white}>
                  {todayQuote.quote}
                </TextWrapper>

                <TextWrapper
                  fontSize={15}
                  style={{ marginTop: 20 }}
                  color={theme.colors.white}
                  fontWeight="700"
                >
                  {todayQuote.author}
                </TextWrapper>
              </Box>
            )}
          </Box>
        </Box>
        <Box margin={[20, 0, 30]} alignItems="center">
          <Image source={require("@assets/images/logoTransparent.png")} />
        </Box>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={show}
        onRequestClose={close}
        onDismiss={close}
        presentationStyle="fullScreen"
      >
        <CreatePlan
          theme={theme}
          onClose={() => {
            setShow(false);
          }}
        />
      </Modal>
      {loading && <Loader />}
    </Page>
  );
};

export default HomeScreen;

const Styles = StyleSheet.create({
  mb12: {
    marginBottom: 12,
  },
  indicator: {
    padding: 3,
    borderRadius: 5,
  },
  indicatorView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
