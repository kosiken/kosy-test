/* eslint-disable import/extensions */
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";

import { IBaseScreenProps } from "@shared-constants";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import { palette } from "@theme/themes";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Box from "@shared-components/box/Box";
import useBoundStore from "store";
import {
  Debug,
  capitalizeFirstLetter,
  putCommas,
  to2DecimalPlaces,
} from "utils";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { LineChart } from "react-native-chart-kit";
import fonts from "@fonts";
import Loader from "@shared-components/loading/Loading";
import riseApi from "@api";
import { from } from "rxjs";
import { BlurView } from "@react-native-community/blur";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Progress from "./components/Progress";
import Badge from "@shared-components/button/Badge";

interface ViewGoalPlanProps extends IBaseScreenProps<"ViewGoalPlan"> {}

const ViewGoalPlan: React.FC<ViewGoalPlanProps> = ({ navigation, route }) => {
  const { colors } = useTheme() as { colors: typeof palette };
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState<
    { buy_rate: number; sell_rate: number } | undefined
  >();
  const years = new Array<number>(5)
    .fill(2034)
    .map((a, i) => (a + i).toString());
  const amounts = new Array<number>(5)
    .fill(24000)
    .map((a, i) => a + (i + 1) * 0.25 * 24000);
  const { user } = useBoundStore();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { goal } = route.params;

  useEffect(() => {
    const response$ = from(riseApi.getRates({}, {}));
    response$.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
          Debug.log(res.data);
          setRates(res.data!);
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

  return (
    <Box>
      <StatusBar backgroundColor={"rgba(255, 197, 177, 1)"} />
      <Box height={0.18 * height} padding={[top, 0, 0]}>
        <Image
          source={require("@assets/images/cart.jpeg")}
          style={{
            width,
            height: 0.18 * height,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height: 0.18 * height,
          }}
          blurType="light"
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        />
        <Box
          flexDirection="row"
          padding={[10, 20, 0]}
          justifyContent="space-between"
        >
          <Box
            style={{ position: "absolute" }}
            height={40}
            justifyContent="center"
            width={"100%"}
            padding={[10, 0, 0]}
          >
            <TextWrapper
              textAlign="center"
              fontSize={24}
              fontWeight="700"
              color={colors.white}
            >
              {goal.plan_name}
            </TextWrapper>
            <TextWrapper textAlign="center" color={colors.white}>
              for{" "}
              {`${capitalizeFirstLetter(
                user?.first_name || "",
              )} ${capitalizeFirstLetter(user?.last_name || "")}`}
            </TextWrapper>
          </Box>
          <RNBounceable
            onPress={() => {
              if (navigation && navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <Box
              backgroundColor="#71879C1A"
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <Icon
                name="arrow-left"
                type={IconType.Feather}
                color={colors.white}
              />
            </Box>
          </RNBounceable>
          <RNBounceable
            onPress={() => {
              if (navigation && navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <Box
              backgroundColor="#71879C1A"
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <Icon
                name="options-vertical"
                type={IconType.SimpleLineIcons}
                color={colors.white}
              />
            </Box>
          </RNBounceable>
        </Box>
      </Box>
      <ScrollView>
        <Box padding={[0, 20]} margin={[20, 0, 0]}>
          <Box alignItems="center" margin={[0, 0, 20]}>
            <TextWrapper fontSize={12}>Plan Balance</TextWrapper>
            <TextWrapper
              style={{ marginVertical: 5 }}
              fontSize={24}
              fontWeight="700"
              color={colors.textBlack}
            >
              ${to2DecimalPlaces(goal.total_returns || 0, true)}
            </TextWrapper>
            {!!rates && (
              <TouchableOpacity>
                <Box flexDirection="row" alignItems="center">
                  <TextWrapper color="#71879C">
                    ~ ₦
                    {to2DecimalPlaces(
                      goal.total_returns * rates.sell_rate,
                      true,
                    )}
                  </TextWrapper>
                  <Box
                    width={10}
                    height={10}
                    borderRadius={5}
                    marginLeft={1}
                    backgroundColor="#71879C"
                    justifyContent="center"
                    alignItems={"center"}
                  >
                    <TextWrapper color={colors.white} fontSize={9}>
                      ?
                    </TextWrapper>
                  </Box>
                </Box>
              </TouchableOpacity>
            )}
            <Box margin={[10, 0]}>
              <TextWrapper
                color={colors.textBlack}
                textAlign="center"
                style={{ marginBottom: 8 }}
              >
                Gains
              </TextWrapper>
              <TextWrapper color={colors.green}>
                +${to2DecimalPlaces(goal.total_returns)} • +
                {to2DecimalPlaces(goal.total_returns / goal.target_amount)}%
              </TextWrapper>
            </Box>
          </Box>
          <Box margin={[0, 0, 20]}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              marginBottom={12}
            >
              <TextWrapper>
                ${to2DecimalPlaces(goal.total_returns, true)} achieved
              </TextWrapper>
              <TextWrapper>
                Target: ${to2DecimalPlaces(goal.target_amount, true)}
              </TextWrapper>
            </Box>
            <Progress
              value={Math.min(goal.total_returns / goal.target_amount, 1)}
            />
          </Box>
          <Box alignItems="center" margin={[12, 0]}>
            <Badge
              label="Results are updated monthly"
              backgroundColor={colors.offWhite}
              textColor="#71879C"
            />
          </Box>
          <RNBounceable>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              borderRadius={5}
              backgroundColor={colors.offWhite}
              padding={[16, 0]}
              margin={[20, 0]}
            >
              <Icon
                name="plus"
                type={IconType.Feather}
                color={colors.primary}
                size={17}
                style={{ marginRight: 10 }}
              />
              <TextWrapper
                fontWeight="700"
                color={colors.primary}
                fontSize={15}
              >
                Fund Plan
              </TextWrapper>
            </Box>
          </RNBounceable>
        </Box>
        <LineChart
          data={{
            labels: years,
            datasets: [
              {
                data: amounts,
              },
            ],
          }}
          width={width - 20} // from react-native
          height={200}
          formatYLabel={(y) => putCommas(y.split(".")[0])}
          yAxisLabel="$"
          yAxisInterval={25000} // optional, defaults to 1
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            color: () => colors.primary,
            labelColor: () => "#94A1AD",
            propsForLabels: {
              fontFamily: fonts.dmsans.regular,
              fontSize: 10,
            },
            linejoinType: "bevel",

            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: colors.primary,
              fill: colors.primary,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        <Box height={height * 0.25} />
      </ScrollView>
      {loading && <Loader />}
    </Box>
  );
};

export default ViewGoalPlan;
