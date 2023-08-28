import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";

import { IBaseScreenProps, SCREENS } from "@shared-constants";
import Page from "@shared-components/page/Page";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import { palette } from "@theme/themes";
import { Alert, ScrollView, View, useWindowDimensions } from "react-native";
import Box from "@shared-components/box/Box";
import useBoundStore from "store";
import { capitalizeFirstLetter, putCommas, to2DecimalPlaces } from "utils";
import dayjs from "dayjs";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { LineChart } from "react-native-chart-kit";
import fonts from "@fonts";
import CustomButton from "@shared-components/button/Button";
import { NavigationService } from "@nav-local/NavigationService";
import Loader from "@shared-components/loading/Loading";
import riseApi from "@api";
import { from } from "rxjs";

interface CreateGoalConfirmProps
  extends IBaseScreenProps<"CreateGoalConfirm"> {}

const CreateGoalConfirm: React.FC<CreateGoalConfirmProps> = ({
  navigation,
}) => {
  const { colors } = useTheme() as { colors: typeof palette };
  const [loading, setLoading] = useState(false);
  const years = new Array<number>(5)
    .fill(2034)
    .map((a, i) => (a + i).toString());
  const amounts = new Array<number>(5)
    .fill(24000)
    .map((a, i) => a + (i + 1) * 0.25 * 24000);
  const { user, goalRequestData, resetGoalRequestData } = useBoundStore();
  const { width } = useWindowDimensions();
  const [rates, setRates] = useState<
    { buy_rate: number; sell_rate: number } | undefined
  >();

  useEffect(() => {
    const response$ = from(riseApi.getRates({}, {}));
    setLoading(true);
    response$.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
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

  const createPlan = () => {
    setLoading(true);
    const response$ = from(
      riseApi.createPlan(
        {},
        {},
        {
          plan_name: goalRequestData.name!,
          target_amount: goalRequestData.amount!,
          maturity_date: dayjs(goalRequestData.date).format("YYYY-MM-DD"),
        },
      ),
    );
    response$.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
          resetGoalRequestData();
          NavigationService.resetStack(
            [
              {
                name: SCREENS.HOME,
              },
              {
                name: SCREENS.CREATE_GOAL_DONE,
                params: {
                  goal: res.data!,
                },
              },
            ],
            1,
          );
        } else {
          Alert.alert(
            "Error",
            res.errorData?.message || "Something Went wrong",
          );
        }
      },
      complete: () => {
        setLoading(false);
      },
    });
  };
  return (
    <Page label="Review" navigation={navigation}>
      <ScrollView>
        <Box padding={[0, 20]} margin={[20, 0, 0]}>
          <Box alignItems="center" margin={[0, 0, 20]}>
            <TextWrapper fontSize={12}>
              {`${capitalizeFirstLetter(
                user?.first_name || "",
              )} ${capitalizeFirstLetter(user?.last_name || "")}`}
            </TextWrapper>
            <TextWrapper
              style={{ marginVertical: 5 }}
              fontSize={24}
              fontWeight="700"
              color={colors.textBlack}
            >
              {rates
                ? "$" +
                  to2DecimalPlaces(
                    (goalRequestData.amount || 0) / rates.buy_rate,
                    true,
                  )
                : ""}
            </TextWrapper>
            <TextWrapper fontSize={12}>
              by {dayjs(goalRequestData.date).format("DD MMMM YYYY")}
            </TextWrapper>

            <Box flexDirection="row" margin={[20, 0]}>
              <Box flexDirection="row" alignItems="center">
                <Icon
                  type={IconType.Entypo}
                  name="dot-single"
                  color={"#94A1AD"}
                  size={30}
                />
                <TextWrapper fontSize={12}>Investments • $50,400</TextWrapper>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Icon
                  type={IconType.Entypo}
                  name="dot-single"
                  color={colors.primary}
                  size={30}
                />
                <TextWrapper fontSize={12}>Returns • $20,803</TextWrapper>
              </Box>
            </Box>
          </Box>
          <Box></Box>
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
          width={width} // from react-native
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
        <Box padding={[0, 20]} margin={[30, 0, 0]}>
          <Box flexDirection="row">
            <Box flex={1}>
              <TextWrapper>Estimated monthly investment</TextWrapper>
            </Box>
            <TextWrapper
              fontFamily={fonts.tomatogrotesk.regular}
              color="#333333"
            >
              $120
            </TextWrapper>
          </Box>
          <View
            style={{
              height: 1,

              backgroundColor: "rgba(113, 135, 156, 0.20);",
              marginVertical: 27,
            }}
          />
          <Box
            flexDirection="row"
            padding={10}
            backgroundColor={colors.offWhite}
            borderRadius={8}
            alignItems="center"
            margin={[0, 0, 27]}
          >
            <Icon name="info" type={IconType.Feather} color={colors.primary} />
            <Box flex={1} margin={[0, 0, 0, 17]}>
              <TextWrapper>
                Returns not guaranteed. Investing involves risk. Read our
                Disclosures.
              </TextWrapper>
            </Box>
          </Box>
          <Box marginBottom={27}>
            <TextWrapper textAlign="center">
              These are your starting settings, they can always be updated.
            </TextWrapper>
          </Box>
          <CustomButton
            label="Agree & Continue"
            onPress={() => {
              createPlan();
            }}
          />

          <Box margin={[12, 0]}>
            <CustomButton
              label="Start over"
              variant="secondary"
              onPress={() => {
                resetGoalRequestData();
                NavigationService.resetStack(
                  [
                    {
                      name: SCREENS.HOME,
                    },
                    { name: SCREENS.CREATE_GOAL_NAME },
                  ],
                  1,
                );
              }}
            />
          </Box>
        </Box>
      </ScrollView>
      {loading && <Loader />}
    </Page>
  );
};

export default CreateGoalConfirm;
