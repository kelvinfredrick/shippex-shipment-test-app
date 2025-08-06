import React, { useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const shipmentStatuses = [
  "Received",
  "Putaway",
  "Delivered",
  "Canceled",
  "Rejected",
  "Lost",
  "On Hold",
];

interface FilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (selectedStatuses: string[]) => void;
}

export default function FilterBottomSheet({
  isVisible,
  onClose,
  onApply,
}: FilterBottomSheetProps) {
  console.log("FilterBottomSheet rendered, isVisible:", isVisible);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleDone = () => {
    onApply(selectedStatuses);
    onClose();
  };

  const handleCancel = () => {
    setSelectedStatuses([]);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.handleIndicator} />
          <View style={styles.container}>
            <View style={styles.header}>
              <Pressable onPress={handleCancel}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.title}>Filters</Text>
              <Pressable onPress={handleDone}>
                <Text style={styles.done}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>SHIPMENT STATUS</Text>

            <View style={styles.statusGrid}>
              {shipmentStatuses.map((status, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.statusButton,
                    selectedStatuses.includes(status) &&
                      styles.statusButtonSelected,
                  ]}
                  onPress={() => toggleStatus(status)}>
                  <Text
                    style={[
                      styles.statusText,
                      selectedStatuses.includes(status) &&
                        styles.statusTextSelected,
                    ]}>
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.5,
    paddingTop: 10,
  },
  handleIndicator: {
    backgroundColor: "#ccc",
    width: 40,
    height: 4,
    alignSelf: "center",
    borderRadius: 2,
    marginBottom: 10,
  },
  container: {
    paddingHorizontal: 0,
    paddingTop: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  cancel: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  done: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 14,
    fontWeight: "400",
    textTransform: "uppercase",
    paddingHorizontal: 20,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 10,
  },
  statusButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.black,
  },
  statusTextSelected: {
    color: COLORS.primary,
  },
});
