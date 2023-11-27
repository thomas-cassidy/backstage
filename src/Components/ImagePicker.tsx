import {
  Alert,
  Dimensions,
  Modal,
  ModalProps,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";
import * as ImagePicker from "expo-image-picker";
import { GlobalColors } from "../Util/GlobalStyles";
import MediaLibrary from "expo-media-library";

type Props = {
  close: () => void;
} & ModalProps;

const { width } = Dimensions.get("window");

const ImagePickerComponent = ({ visible, onRequestClose, close }: Props) => {
  //   useEffect(() => {
  //     const pickImage = async () => {
  //       await ImagePicker.launchImageLibraryAsync();
  //     };
  //     pickImage();
  //   }, []);
  const [images, setImages] = useState<MediaLibrary.Asset[]>([]);
  const [perm, getPerm] = ImagePicker.useMediaLibraryPermissions();

  const getAlbums = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync({ first: 10 });
    setImages(() => {
      let newImages: MediaLibrary.Asset[] = [];

      assets.map((a) => {
        if (a.mediaType === "photo") {
          newImages.push(a);
        }
      });
      return newImages;
    });
  };

  useEffect(() => {
    if (!perm?.granted) {
      getPerm();
    }
    getAlbums();
  }, []);

  return (
    <Modal {...{ visible, onRequestClose }} animationType={"slide"} transparent>
      <TouchableOpacity style={{ flex: 0.5 }} onPress={close} />
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
        }}
      >
        <PageContainer light>
          <View style={{ backgroundColor: GlobalColors.background }}>
            <PageHeader label="Select Image" light={true} back onBack={close} />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          >
            {images.map((i) => {
              if (i.uri) {
                return (
                  <TouchableOpacity
                    key={i.filename}
                    onPress={() => Alert.alert("Use this image for this cast member?")}
                  >
                    <Image
                      source={{ uri: i.uri }}
                      style={{ height: width / 2, width: width / 2 }}
                    />
                  </TouchableOpacity>
                );
              }
            })}
          </ScrollView>
        </PageContainer>
      </View>
    </Modal>
  );
};

export default ImagePickerComponent;
