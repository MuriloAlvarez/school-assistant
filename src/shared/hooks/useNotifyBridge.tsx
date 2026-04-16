import { useEffect } from "react";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import { useNotifyStore, type NotifyPayload } from "@/src/shared/store";

function renderNotifyToast(id: string, payload: NotifyPayload) {
  return (
    <Toast nativeID={id} action={payload.variant} variant="solid">
      <VStack space="xs">
        <ToastTitle>{payload.title}</ToastTitle>
        <ToastDescription>{payload.message}</ToastDescription>
      </VStack>
    </Toast>
  );
}

export const useNotifyBridge = () => {
  const toast = useToast();
  const setListener = useNotifyStore((state) => state.setListener);

  useEffect(() => {
    setListener((payload) => {
      toast.show({
        placement: "top",
        render: ({ id }) => renderNotifyToast(id, payload),
      });
    });

    return () => {
      setListener(null);
    };
  }, [setListener, toast]);
};
