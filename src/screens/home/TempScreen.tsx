import React from "react";
import Page from "@shared-components/page/Page";
import Box from "@shared-components/box/Box";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";

const TempScreen = () => {
  return (
    <Page label="Temporary">
      <Box flex={1} alignItems="center" justifyContent="center">
        <TextWrapper>This is a temporay Screen</TextWrapper>
      </Box>
    </Page>
  );
};

export default TempScreen;
