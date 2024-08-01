import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  DimensionValue,
} from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import type { Country } from '@/types/Country';

const { width: screenWidth } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(screenWidth * 0.9, 400); // 90% of screen width or 400, whichever is smaller

interface CountryPickerModalProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
  displayProperty: keyof Country;
  placeholder?: string;
  pickerButtonWidth?: DimensionValue;
}

const CountryPickerModal = ({
  countries,
  selectedCountry,
  onSelectCountry,
  displayProperty,
  placeholder = 'Select country',
  pickerButtonWidth = 140 as DimensionValue,
}: CountryPickerModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCountry = (country: Country) => {
    onSelectCountry(country);
    setModalVisible(false);
  };
  const getDisplayText = (country: Country) => {
    return country[displayProperty]?.toString() || '';
  };

  const reorderedCountries = selectedCountry
    ? [
        selectedCountry,
        ...countries.filter(
          (country) =>
            country[displayProperty] !== selectedCountry[displayProperty]
        ),
      ]
    : countries;

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.pickerButton, { width: pickerButtonWidth }]}
      >
        {selectedCountry ? (
          <View style={styles.countryItem}>
            <Image
              source={{ uri: selectedCountry?.flag }}
              style={styles.buttonCountry}
              cachePolicy="memory-disk"
            />
            <Text style={styles.countryButton}>
              {getDisplayText(selectedCountry)}
            </Text>
          </View>
        ) : (
          <Text>{placeholder}</Text>
        )}
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.placeholderText}>{placeholder}</Text>
            <FlatList
              data={reorderedCountries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCountry(item)}
                  style={[
                    styles.countryItem,
                    styles.countryItemList,
                    selectedCountry?.[displayProperty] ===
                      item[displayProperty] && styles.selectedCountryItem,
                  ]}
                >
                  <Image
                    source={{ uri: item.flag }}
                    style={styles.country}
                    cachePolicy="memory-disk"
                  />
                  <Text style={styles.countryDisplayText}>
                    {getDisplayText(item)}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.flatList}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 16,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  flatList: {
    width: '100%',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  countryItemList: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    padding: 10,
  },
  country: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  countryDisplayText: {
    fontSize: 16,
    overflow: 'hidden',
  },
  countryButton: {
    fontSize: 16,
    flexShrink: 1,
    overflow: 'hidden',
  },
  buttonCountry: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.blue,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  selectedCountryItem: {
    backgroundColor: Colors.lightGray,
  },
});

export default CountryPickerModal;
