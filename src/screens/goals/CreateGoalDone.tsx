import React from "react";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import { NavigationService } from "@nav-local/NavigationService";
import DoneComponent from "@shared-components/done/DoneComponent";

interface CreateGoalDoneProps extends IBaseScreenProps<"CreateGoalDone"> {}

const CreateGoalDone: React.FC<CreateGoalDoneProps> = () => {
  return (
    <DoneComponent
      title="You just created your plan."
      description="Well done, Deborah"
      prompt="View Plan"
      onContinue={() => {
        NavigationService.resetHard(SCREENS.HOME);
      }}
    />
  );
};

export default CreateGoalDone;
