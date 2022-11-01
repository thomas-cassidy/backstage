import { View, Text } from "react-native";
import React, { useEffect } from "react";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

type Props = {};

const ImagePickerComponent = (props: Props) => {
    useEffect(() => {
        const pickImage = async () => {
            await ImagePicker.launchImageLibraryAsync();
        };
        pickImage();
    }, []);
    return (
        <PageContainer light>
            <PageHeader label='Select Image' light={false} />
            <View style={{ flex: 1 }}></View>
        </PageContainer>
    );
};

export default ImagePickerComponent;
