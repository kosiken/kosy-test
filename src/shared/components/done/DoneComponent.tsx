import { Image, ScrollView } from "react-native";
import React from "react";
import Page from "@shared-components/page/Page";
import Box from "@shared-components/box/Box";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import { useTheme } from "@react-navigation/native";
import CustomButton from "@shared-components/button/Button";

interface DoneComponentProps {
  title: string;
  description: string;
  onContinue: () => void;
  prompt?: string;
}

const DoneComponent: React.FC<DoneComponentProps> = ({
  title,
  description,
  onContinue,
  prompt = "Okay",
}) => {
  const { colors } = useTheme();
  return (
    <Page>
      <ScrollView style={{ flex: 1 }}>
        <Box alignItems="center" marginTop={100} marginBottom={36}>
          <Image source={require("@assets/images/done.png")} />
        </Box>
        <Box alignItems="center">
          <Box width={200}>
            <TextWrapper
              fontWeight="500"
              color={colors.textBlack}
              fontSize={20}
              textAlign="center"
            >
              {title}
            </TextWrapper>
            <Box marginTop={10}>
              <TextWrapper fontSize={15} textAlign="center">
                {description}
              </TextWrapper>
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Box padding={[0, 20]}>
        <CustomButton
          label={prompt}
          onPress={() => {
            onContinue();
          }}
        />
      </Box>
    </Page>
  );
};

export default DoneComponent;
