// components/AppText.js
import React from 'react';
import { Text } from 'react-native';
import { FONTS, COLORS } from '../styles/theme';

export default function AppText({ children, style, ...rest }) {
    return (
        <Text
            {...rest}
            style={[
                {
                    fontFamily: FONTS.regular,
                    fontSize: 16,
                    color: COLORS.text,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
}
