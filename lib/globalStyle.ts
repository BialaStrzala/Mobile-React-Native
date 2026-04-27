import { StyleSheet } from "react-native";
import { colors, radius, sizes } from "./theme";

export const globalStyles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.backgroundColor,
        width: "100%",
        height: "100%",
    },
    card: {
        backgroundColor: colors.cardColor,
        margin: 20,
        borderRadius: radius.lg,
        width: "80%",
        alignContent: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        height: 80,
        alignItems: "center",
        fontWeight: "bold",
        marginBottom: 16,
        backgroundColor: colors.primary,
    },
    headerText: {
        marginTop: 35,
        fontSize: sizes.headerText,
        fontWeight: "bold",
        letterSpacing: 1,
        color: colors.cardColor,
    },

    inputField: {
        borderWidth: 2,
        borderColor: colors.backgroundColor,
        padding: 10,
        borderRadius: radius.sm,
    },
    titleText: {
        marginTop: 15,
        alignSelf: "center",
        fontSize: sizes.titleText,
        fontWeight: "bold",
        letterSpacing: 1,
        marginBottom: 10,
        color: colors.primary,
    },

    scrollViewContent: {
        padding: 16,
        paddingBottom: 32,
    },

    mainButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: radius.md,
        alignItems: "center",
    },
    mainButtonPressed: {
        backgroundColor: colors.primaryDark,
    },
    mainButtonText: {
        color: colors.cardColor,
        fontWeight: "600",
    },

    secondaryButton: {
        padding: 12,
        borderRadius: radius.md,
        alignItems: "center",
    },
    secondaryButtonPressed: {
        backgroundColor: colors.backgroundColor,
    },
    secondaryButtonText: {
        color: colors.primary,
        fontWeight: "500",
    },
})