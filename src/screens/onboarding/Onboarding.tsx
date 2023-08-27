import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  NativeScrollEvent,
} from "react-native";
import React, { useState } from "react";
import { palette } from "@theme/themes";
import Page from "@shared-components/page/Page";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import { IBaseScreenProps } from "@shared-constants";
import Box from "@shared-components/box/Box";
import CustomButton from "@shared-components/button/Button";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import AnimatedFadeInOut from "@shared-components/animatedFadeInOut/AnimatedFadeInOut";

interface OnboardingProps extends IBaseScreenProps<"Onboarding"> {}

const data = [
  {
    title: "Quality assets",
    subtitle:
      "Rise invests your money into the best dollar investments around the world.",
    image: () => (
      <Image source={require("./assets/badgeIntro.png")} style={Styles.image} />
    ),
    color: palette.orange,
    bgColor: "#FEFAF7",
  },
  {
    title: "Superior Selection",
    subtitle:
      "Our expert team and intelligent algorithms select assets that beat the markets. ",
    image: () => (
      <Image
        source={require("./assets/searchIntro.png")}
        style={Styles.image}
      />
    ),
    color: palette.indigo,
    bgColor: "#FDF4F9",
  },
  {
    title: "Better Performance",
    subtitle:
      "You earn more returns, achieve more of your financial goals and protect your money from devaluation.",
    image: () => (
      <Image
        source={require("./assets/speedometerIntro.png")}
        style={Styles.image}
      />
    ),
    color: palette.teal,
    bgColor: "#F6FFFE",
  },
];

const Dot: React.FC<{
  scrollX: SharedValue<number>;
  index: number;
  item: (typeof data)[0];
  width: number;
}> = ({ scrollX, index, item, width }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const style = useAnimatedStyle(() => ({
    width: 8,
    height: 8,
    backgroundColor: item.color,
    opacity: interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    ),
    marginRight: index === data.length - 1 ? 0 : 14,
  }));
  return <Animated.View style={[Styles.indicator, style]} />;
};

const Indicator: React.FC<{ scrollX: SharedValue<number>; width: number }> = ({
  scrollX,
  width,
}) => {
  return (
    <Box style={[{ position: "relative" }]}>
      <Box
        style={[
          Styles.indicatorView,
          { position: "absolute", top: 0, left: 0, width },
        ]}
      >
        {data.map((_, index) => (
          <View
            key={`indicator-base-${index}`}
            style={[
              Styles.indicator,
              {
                width: 8,
                height: 8,
                backgroundColor: "#71879C33",

                marginRight: index === data.length - 1 ? 0 : 14,
              },
            ]}
          />
        ))}
      </Box>
      <Box style={Styles.indicatorView}>
        {data.map((item, index) => {
          return (
            <Dot
              key={`indicator-${index}`}
              scrollX={scrollX}
              item={item}
              index={index}
              width={width}
            />
          );
        })}
      </Box>
    </Box>
  );
};

const Onboarding: React.FC<OnboardingProps> = () => {
  //   const theme = useTheme();
  //   const colors = theme.colors as typeof palette;
  const { width } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const sx = useSharedValue(0);
  const recordScroll = (event: NativeScrollEvent) => {
    const { x } = event.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    setCurrentPage(indexOfNextScreen);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      sx.value = event.contentOffset.x;
      runOnJS(recordScroll)(event);
    },
  });

  const renderData = ({ item }: { item: (typeof data)[0] }) => (
    <Box width={width}>
      <Box alignItems="center">{item.image()}</Box>
    </Box>
  );
  const currentItem = data[currentPage % data.length];
  return (
    <Page style={{ backgroundColor: data[currentPage].bgColor }}>
      <Box margin={[20, 0]}>
        <Animated.FlatList
          data={data}
          keyExtractor={(item) => item.title}
          renderItem={renderData}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
        />
      </Box>
      <Indicator scrollX={sx} width={width} />
      <Box marginTop={20} padding={[0, 20]} flex={1}>
        <TextWrapper
          style={Styles.mb12}
          fontWeight="500"
          color={currentItem.color}
          fontSize={24}
        >
          {currentItem.title}
        </TextWrapper>
        <TextWrapper fontSize={18}>{currentItem.subtitle}</TextWrapper>

        <Box marginTop={60}>
          <AnimatedFadeInOut show={currentPage < 2}>
            <Box flexDirection="row" justifyContent="space-between">
              <Box width={50}>
                <CustomButton
                  variant="secondary"
                  leftComponent={
                    <Icon
                      name="arrow-left"
                      type={IconType.Feather}
                      color={currentPage === 0 ? "#94A1AD" : currentItem.color}
                    />
                  }
                />
              </Box>
              <Box width={[103]}>
                <CustomButton
                  label="Next"
                  textColor={currentItem.color}
                  variant="secondary"
                  rightComponent={
                    <Icon
                      name="arrow-right"
                      type={IconType.Feather}
                      color={currentItem.color}
                    />
                  }
                />
              </Box>
            </Box>
          </AnimatedFadeInOut>
          <AnimatedFadeInOut show={currentPage === 2}>
            <Box>
              <Box marginBottom={16}>
                <CustomButton label="Sign Up" />
              </Box>
              <CustomButton variant="secondary" label="Sign In" />
            </Box>
          </AnimatedFadeInOut>
        </Box>
      </Box>
    </Page>
  );
};

export default Onboarding;

const Styles = StyleSheet.create({
  indicatorView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    padding: 3,
    borderRadius: 5,
  },
  image: { width: 300, height: 300 },
  mb12: { marginBottom: 12 },
});
