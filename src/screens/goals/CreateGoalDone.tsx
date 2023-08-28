import React from "react";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import DoneComponent from "@shared-components/done/DoneComponent";
import useBoundStore from "store";
import { capitalizeFirstLetter } from "utils";

interface CreateGoalDoneProps extends IBaseScreenProps<"CreateGoalDone"> {}

const CreateGoalDone: React.FC<CreateGoalDoneProps> = ({
  navigation,
  route,
}) => {
  const { user } = useBoundStore();
  return (
    <DoneComponent
      title="You just created your plan."
      description={`Well done, ${capitalizeFirstLetter(
        user?.first_name || "",
      )}`}
      prompt="View Plan"
      onContinue={() => {
        navigation.replace(SCREENS.VIEW_GOAL_PLAN, { goal: route.params.goal });
      }}
    />
  );
};

export default CreateGoalDone;
