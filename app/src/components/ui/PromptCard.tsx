import { Text, View } from "react-native";

import { colors } from "../../theme/tokens";
import Card from "./Card";
import GameBadge from "./GameBadge";

type Props = {
  title?: string;
  text: string;
  footnote?: string;
};

export default function PromptCard({ title, text, footnote }: Props) {
  return (
    <Card className="p-5" glow>
      {title ? <GameBadge label={title} tone="cyan" /> : null}

      <View className={`${title ? "mt-5" : ""} min-h-[144px] justify-center`}>
        <Text
          className="text-center text-2xl font-extrabold leading-9"
          style={{ color: colors.text }}
        >
          {text}
        </Text>

        {footnote ? (
          <Text className="mt-4 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
            {footnote}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}
