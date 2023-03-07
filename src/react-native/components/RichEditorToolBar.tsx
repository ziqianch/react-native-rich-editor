import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import type { IFormatProps } from './format/Format';
import { Format } from './format/Format';

interface IRichEditorToolBarProps {
  formats: Array<IFormatProps | JSX.Element>;
  style?: ViewStyle;
}

const ToolBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 999,
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.2)',
  },
  button: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const RichEditorToolBar: FC<IRichEditorToolBarProps> = (props) => {
  const { width } = useWindowDimensions();
  const { formats, style } = props;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ ...ToolBarStyles.container, width, ...style }}>
        {formats.map((format, index) =>
          React.isValidElement(format) ? (
            <View key={index}>{format}</View>
          ) : (
            <View key={index}>
              {/*@ts-ignore*/}
              <Format {...format} />
            </View>
          )
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default RichEditorToolBar;
