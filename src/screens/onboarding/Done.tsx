import React from "react";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import { NavigationService } from "@nav-local/NavigationService";
import DoneComponent from "@shared-components/done/DoneComponent";

interface DoneProps extends IBaseScreenProps<"Done"> {}

const Done: React.FC<DoneProps> = () => {
  return (
    <DoneComponent
      title="You just created your Rise account"
      description="Welcome to Rise, let’s take you home"
      onContinue={() => {
        NavigationService.resetHard(SCREENS.HOME);
      }}
    />
  );
};

export default Done;
