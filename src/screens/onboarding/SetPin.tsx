import {
  Alert,
  Platform,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";

import { IBaseScreenProps, SCREENS } from "@shared-constants";
import Page from "@shared-components/page/Page";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import Box from "@shared-components/box/Box";
import { FlatList } from "react-native-gesture-handler";
import DoneComponent from "@shared-components/done/DoneComponent";
import { NavigationService } from "@nav-local/NavigationService";

interface SetPinProps extends IBaseScreenProps<"SetPin"> {}

type PinNumber =
  | {
      display: number;
      value: number;
    }
  | {
      display: React.JSX.Element;
      value: string;
    };

const SetPin: React.FC<SetPinProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  const [pin, setPin] = useState("");
  const [pins, setPins] = useState({
    first: "",
    second: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const _array = new Array(6).fill(0);

  const values = [
    {
      display: 1,
      value: 1,
    },
    {
      display: 2,
      value: 2,
    },
    {
      display: 3,
      value: 3,
    },
    {
      display: 4,
      value: 4,
    },
    {
      display: 5,
      value: 5,
    },
    {
      display: 6,
      value: 6,
    },
    {
      display: 7,
      value: 7,
    },
    {
      display: 8,
      value: 8,
    },
    {
      display: 9,
      value: 9,
    },
    {
      display: (
        <Box
          width={72}
          height={72}
          borderRadius={40}
          backgroundColor="#71879C1A"
          alignItems="center"
          justifyContent="flex-end"
          padding={[0, 0, 10, 0]}
        >
          <TextWrapper fontSize={24} fontWeight="600" color={colors.primary}>
            .
          </TextWrapper>
        </Box>
      ),

      value: "dot",
    },
    {
      display: 0,
      value: 0,
    },
    {
      display: (
        <Box
          width={72}
          height={72}
          borderRadius={40}
          backgroundColor="#71879C1A"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            name="delete"
            size={24}
            type={IconType.Feather}
            color={colors.primary}
          />
        </Box>
      ),
      value: "delete",
    },
  ];

  const close = () => {
    setShow(false);
  };

  const renderPin = () => {
    const pinToArray = pin.split("");

    return _array.map((_, index) => {
      const exists = !!pinToArray[index];
      if (exists) {
        return (
          <Box
            key={`pin-${index}`}
            width={42}
            height={42}
            style={{ borderColor: colors.primary, borderWidth: 1.5 }}
            borderRadius={5}
            justifyContent="center"
            alignItems="center"
          >
            <Icon
              key={index}
              type={IconType.Entypo}
              name="dot-single"
              color={colors.textBlack}
              size={30}
            />
          </Box>
        );
      }
      return (
        <Box
          key={`pin-${index}`}
          borderRadius={5}
          width={42}
          height={42}
          style={{ borderColor: "#71879C33", borderWidth: 1 }}
        />
      );
    });
  };

  useEffect(() => {
    const { first, second } = pins;
    if (first.length === 6 && second.length === 6 && currentPage > 0) {
      if (first !== second) {
        Alert.alert("Error", "Pins do not match");
        setPin("");
      } else {
        setShow(true);
      }
    }
  }, [pins, currentPage]);

  useEffect(() => {
    const currentPin = pin;
    if (currentPin?.length >= 6) {
      if (currentPage === 0) {
        setPins({
          first: currentPin,
          second: "",
        });
        setTimeout(() => {
          setPin("");
          setCurrentPage((c) => c + 1);
        }, 400);
        return;
      } else {
        setPins((p) => ({ ...p, second: currentPin }));
      }
    }
  }, [pin, currentPage]);
  const handleOnClick = (value: number | string) => {
    let currentPin = pin;
    if (value === "dot") {
      return;
    }
    if (currentPin?.length >= 6) {
      if (currentPage === 0) {
        setPins({
          first: currentPin,
          second: "",
        });
        setPin("");
        setCurrentPage((c) => c + 1);
        return;
      } else {
        setPins((p) => ({ ...p, second: currentPin }));
      }
    }
    if (currentPin?.length >= 6 && value !== "delete" && value !== "dot") {
      return;
    }
    if (value === "delete") {
      const newAmount = currentPin?.substring(0, currentPin?.length - 1);
      setPin(newAmount);
      return;
    }
    currentPin += value;
    setPin(currentPin);
  };

  const handleBack = () => {
    if (currentPage === 0 && navigation.canGoBack()) {
      navigation.goBack();
    } else if (currentPage > 0) {
      setCurrentPage((c) => c - 1);
    }
  };
  const renderItem = ({ item }: { item: PinNumber }) => {
    return (
      <TouchableOpacity
        style={{
          width: "33.3%",
          alignItems: "center",
          paddingVertical: Platform.select({
            android: 18,
            ios: 25,
          }),
        }}
        onPress={() => {
          handleOnClick(item.value);
        }}
      >
        {typeof item.display === "number" ||
        typeof item.display === "string" ? (
          <Box
            width={72}
            height={72}
            borderRadius={40}
            backgroundColor="#71879C1A"
            alignItems="center"
            justifyContent="center"
          >
            <TextWrapper fontSize={24} fontWeight="600" color={colors.primary}>
              {item.display}
            </TextWrapper>
          </Box>
        ) : (
          item.display
        )}
      </TouchableOpacity>
    );
  };
  return (
    <Page
      navigationComponent={
        <TouchableOpacity onPress={() => handleBack()}>
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
              color={colors.primary}
            />
          </Box>
        </TouchableOpacity>
      }
      navigation={navigation}
    >
      <Box padding={[0, 20]} margin={[20, 0]}>
        <TextWrapper color={colors.textBlack} fontWeight="500" fontSize={20}>
          {`${currentPage === 0 ? "Create" : "Confirm"} a 6-digit PIN`}
        </TextWrapper>
        <Box marginTop={10}>
          <TextWrapper fontSize={15}>
            You’ll use this PIN to sign in and confirm transactions
          </TextWrapper>
        </Box>
      </Box>
      <Box padding={[0, 20]} flex={1}>
        <Box maxWidth={400} flexDirection="row" justifyContent="space-around">
          {renderPin()}
        </Box>
      </Box>
      <Box padding={[0, 20]}>
        <FlatList
          data={values}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.value)}
          numColumns={3}
          scrollEnabled={false}
        />
      </Box>
      <Modal
        animationType="slide"
        visible={show}
        onRequestClose={close}
        onDismiss={close}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <DoneComponent
            title="You’ve created your PIN"
            description="Keep your account safe with your secret PIN. Do not share this PIN with anyone."
            onContinue={() => {
              close();
              NavigationService.resetHard(SCREENS.HOME);
            }}
          />
        </SafeAreaView>
      </Modal>
    </Page>
  );
};

export default SetPin;
