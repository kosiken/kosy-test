/* eslint-disable react-native/no-inline-styles */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";

import Box from "@shared-components/box/Box";
import TextInputWrapper from "@shared-components/text-input/TextInput";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";

export type Option = {
  label?: string;
  value: string;
  index?: number;
};

export type PickerFunctions = {
  openPicker: () => void;
  closePicker: () => void;
};

export interface ModalPickerProps {
  label: string;
  data: Option[];
  selected?: Option;
  selectItem: (s: Option) => void;
  snapPoint?: number;
  adjustToContentHeight?: boolean;
  showSearch?: boolean;
}
export default forwardRef<PickerFunctions | undefined, ModalPickerProps>(
  function ModalPicker(props, ref) {
    const {
      label,
      data,
      selected,
      selectItem,
      showSearch = true,
      snapPoint = 600,
      adjustToContentHeight = false,
    } = props;
    const [searchValue, setSearchValue] = useState("");
    const [modalData, setModalData] = useState<Option[]>([]);
    const { colors } = useTheme();

    useEffect(() => {
      let filteredData = data;
      if (searchValue?.length > 0 && data?.length > 0) {
        filteredData = data.filter((item) =>
          (item.label || "").toLowerCase().includes(searchValue.toLowerCase()),
        );
        setModalData(filteredData);
        return;
      }
      setModalData(filteredData);
    }, [data, searchValue]);

    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
      modalizeRef.current?.open();
    };

    const onClose = () => {
      modalizeRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
      openPicker() {
        onOpen();
      },
      closePicker() {
        onClose();
      },
    }));

    const handleSelectItem = (item: Option) => {
      selectItem(item);
      onClose();
    };

    return (
      <Modalize
        ref={modalizeRef}
        snapPoint={snapPoint}
        adjustToContentHeight={adjustToContentHeight}
        rootStyle={{ elevation: 11, zIndex: 1001 }}
        disableScrollIfPossible={false}
      >
        <Box>
          <Box>
            <TextWrapper color={colors.white}>
              {label || "Select an item"}
            </TextWrapper>
          </Box>
          <Box padding={[0, 20]}>
            {showSearch && (
              <Box margin={[0, 0, 10]}>
                <TextInputWrapper
                  value={searchValue}
                  onChangeText={setSearchValue}
                  label="Search"
                />
              </Box>
            )}
            {modalData?.length > 0 &&
              modalData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={Styles.pickerViewItem}
                  onPress={() => handleSelectItem(item)}
                >
                  <TextWrapper fontSize={16}>{item?.label}</TextWrapper>
                  {selected?.value === item?.value && (
                    <Icon
                      name="check"
                      size={20}
                      color={colors.primary}
                      type={IconType.Feather}
                    />
                  )}
                </TouchableOpacity>
              ))}
          </Box>
        </Box>
      </Modalize>
    );
  },
);

const Styles = StyleSheet.create({
  pickerViewItem: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 13,
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 2,
  },
});
