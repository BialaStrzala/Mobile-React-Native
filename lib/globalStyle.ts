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
        borderRadius: radius.lg,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
        alignSelf: "center",
        fontSize: sizes.titleText,
        fontWeight: "bold",
        letterSpacing: 1,
        marginBottom: 10,
        color: colors.primary,
        marginTop: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: 12,
    },

    scrollViewContent: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 32,
    },

    mainButton: {
        backgroundColor: colors.primary,
        padding: sizes.buttonPadding,
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

    tertiaryButton: {
        backgroundColor: colors.colorBlue,
        padding: sizes.buttonPadding,
        borderRadius: radius.md,
        alignItems: "center",
    },
    tertiaryButtonPressed: {
        backgroundColor: colors.colorDarkBlue,
    },
    tertiaryButtonText: {
        color: colors.cardColor,
        fontWeight: "600",
        textTransform: "uppercase",
    },

    ratingText: {
        fontSize: 12,
        color: colors.textLightMuted,
        marginLeft: 6,
    },

    loadingCenter:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})