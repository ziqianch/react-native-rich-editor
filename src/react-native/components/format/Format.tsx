import React, { FC } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import type { Sources } from 'quill';
import { useFormat } from '../../hooks/useFormat';

export interface IFormatProps {
  format: string;
  icon?: string | (() => JSX.Element);
  style?: ViewStyle;
  onValueChange?: (value: any) => void;
  render?: (
    value: any,
    setFormat: (v: any, source?: Sources) => void
  ) => JSX.Element;
}
const styles = StyleSheet.create({
  default: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const Format: FC<IFormatProps> = (props) => {
  const { format, icon, render, style, onValueChange } = props;
  const { formatValue, setFormatValue } = useFormat(format);
  const isActive = !!formatValue;

  const onPress = React.useCallback(() => {
    setFormatValue(!formatValue);
    onValueChange?.(!formatValue);
  }, [setFormatValue, formatValue, onValueChange]);

  return render ? (
    render(formatValue, setFormatValue)
  ) : (
    <TouchableOpacity style={{ ...styles.default, ...style }} onPress={onPress}>
      {typeof icon === 'function' ? (
        icon()
      ) : (
        <MaterialIcons
          // @ts-ignore
          name={icon}
          size={24}
          color={isActive ? '#06c' : 'black'}
        />
      )}
    </TouchableOpacity>
  );
};

export default Format;
