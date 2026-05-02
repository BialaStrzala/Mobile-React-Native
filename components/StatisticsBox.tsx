import { colors, radius } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatisticsBoxProps {
    totalBooks: number;
    finishedCount: number;
    readingCount: number;
    planningCount: number;
    discontinuedCount: number;
    averageRating: string;
}

const StatisticsBox: React.FC<StatisticsBoxProps> = ({
    totalBooks,
    finishedCount,
    readingCount,
    planningCount,
    discontinuedCount,
    averageRating,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Statistics</Text>

            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Books</Text>
                <Text style={styles.statValue}>{totalBooks}</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <FontAwesome name="check-circle" size={20} color={colors.colorGreen} />
                    <Text style={styles.statBoxValue}>{finishedCount}</Text>
                    <Text style={styles.statBoxLabel}>Finished</Text>
                </View>
                <View style={styles.statBox}>
                    <FontAwesome name="hourglass-half" size={20} color={colors.colorBlue} />
                    <Text style={styles.statBoxValue}>{readingCount}</Text>
                    <Text style={styles.statBoxLabel}>Reading</Text>
                </View>
                <View style={styles.statBox}>
                    <FontAwesome name="book" size={20} color={colors.colorOrange} />
                    <Text style={styles.statBoxValue}>{planningCount}</Text>
                    <Text style={styles.statBoxLabel}>Planning</Text>
                </View>
                <View style={styles.statBox}>
                    <FontAwesome name="times-circle" size={20} color={colors.colorRed} />
                    <Text style={styles.statBoxValue}>{discontinuedCount}</Text>
                    <Text style={styles.statBoxLabel}>Discontinued</Text>
                </View>
            </View>

            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average Rating</Text>
                <View style={styles.avgRatingRow}>
                    <FontAwesome name="star" size={18} color={colors.colorOrange} />
                    <Text style={styles.avgRatingValue}>{averageRating}</Text>
                </View>
            </View>
        </View>
    );
};

export default StatisticsBox;

const styles = StyleSheet.create({
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
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: 12,
    },
    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    statLabel: {
        fontSize: 14,
        color: colors.textLightMuted,
    },
    statValue: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    statBox: {
        alignItems: "center",
        flex: 1,
    },
    statBoxValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textMuted,
        marginTop: 4,
    },
    statBoxLabel: {
        fontSize: 10,
        color: colors.textLightMuted,
        marginTop: 2,
    },
    avgRatingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avgRatingValue: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginLeft: 4,
    },
});