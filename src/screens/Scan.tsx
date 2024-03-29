import React, { useCallback, useEffect, useState } from 'react';

import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';
import { Icon, Center } from 'native-base';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Background } from '../components/Background';
import { CircleButton } from '../components/CircleButton';
import { Container } from '../components/Container';
import { Empty } from '../components/Empty';
import { Header } from '../components/Header';
import { Scanner } from '../components/Scanner';
import { ValidateDocumentDTO } from '../hooks/document';
import { useNotification } from '../hooks/notification';

export const Scan: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const { notification } = useNotification();

  const requestCameraPermission = useCallback(async () => {
    const { granted } = await BarCodeScanner.requestPermissionsAsync();

    setHasPermission(granted);
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const handleQRCodeScanned = useCallback(
    async ({ data }: BarCodeScannerResult) => {
      const validDomains = ['dne.vc', 'meiaentrada.org.br'];

      setScanned(true);

      const paramsArray = String(data).split('/');

      if (!validDomains.includes(paramsArray[2])) {
        await notification({
          type: NotificationFeedbackType.Error,
          message: 'QR Code inválido!',
        });

        return;
      }

      const params: ValidateDocumentDTO = {
        codigoUso: paramsArray[paramsArray.length - 2] as string,
        dataNascimento: paramsArray[paramsArray.length - 1] as string,
      };

      await notificationAsync(NotificationFeedbackType.Success);

      navigation.navigate(
        'AddDocument' as never,
        {
          params,
        } as never,
      );
    },
    [navigation, notification],
  );

  const handleAction = useCallback(() => {
    if (scanned) {
      setScanned(false);
      return;
    }
    navigation.navigate('Home' as never);
  }, [navigation, scanned]);

  return (
    <Background>
      <Container>
        <Header
          title="Scan"
          subtitle={`Scaneie o QR Code presente no seu${'\n'}documento estudantil.`}
          marginBottom="18px"
        />
        {!hasPermission && (
          <Empty
            message={`Você precisa conceder o acesso${'\n'}à câmera em suas configurações.`}
          />
        )}
        {hasPermission && (
          <Center flex={1}>
            <Scanner scanned={scanned} onScan={handleQRCodeScanned} />
            <CircleButton
              marginTop="-24px"
              marginBottom="20px"
              isSecondary={!scanned}
              onPress={handleAction}
            >
              {scanned ? (
                <Icon
                  as={Feather}
                  name="plus"
                  color="brand.light.500"
                  size="24px"
                />
              ) : (
                <Icon
                  as={Feather}
                  name="x"
                  color="brand.light.500"
                  size="24px"
                />
              )}
            </CircleButton>
          </Center>
        )}
      </Container>
    </Background>
  );
};
