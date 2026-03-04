import { Text, View } from "react-native";
import Card from "./Card";
import { colors } from "../../theme/tokens";

type Props = {
  title?: string;
  text: string;
  footnote?: string;
};

export default function PromptCard({ title, text, footnote }: Props) {
  return (
    <Card className="p-5" glow>
      {title ? (
        <Text className="text-xs font-bold tracking-widest" style={{ color: colors.glow }}>
          {title.toUpperCase()}
        </Text>
      ) : null}

      <View className="mt-3">
        <Text className="text-2xl font-extrabold leading-tight" style={{ color: colors.text }}>
          {text}
        </Text>

        {footnote ? (
          <Text className="mt-3 text-xs" style={{ color: colors.textMuted }}>
            {footnote}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}