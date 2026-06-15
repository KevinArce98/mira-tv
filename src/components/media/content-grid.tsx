import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import { PosterCard } from '@/components/media/poster-card';
import { Spacing } from '@/constants/theme';
import type { Contenido } from '@/types/models';

const GAP = Spacing.three;
const MIN_CARD_WIDTH = 110;

export function ContentGrid({
  items,
  onPressItem,
  aspectRatio = 2 / 3,
  ListHeaderComponent,
  ListEmptyComponent,
  contentInsetBottom = 0,
}: {
  items: Contenido[];
  onPressItem: (item: Contenido) => void;
  aspectRatio?: number;
  ListHeaderComponent?: React.ComponentProps<typeof FlatList>['ListHeaderComponent'];
  ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  contentInsetBottom?: number;
}) {
  const { width } = useWindowDimensions();
  const horizontalPadding = Spacing.three * 2;
  const available = width - horizontalPadding;
  const columns = Math.max(2, Math.floor((available + GAP) / (MIN_CARD_WIDTH + GAP)));
  const cardWidth = (available - GAP * (columns - 1)) / columns;

  return (
    <FlatList
      data={items}
      key={columns}
      numColumns={columns}
      keyExtractor={(it) => it.id}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: contentInsetBottom + Spacing.four },
      ]}
      renderItem={({ item }) => (
        <View style={{ marginBottom: GAP }}>
          <PosterCard
            title={item.nombre}
            posterUrl={item.poster_url}
            subtitle={item.categoria}
            aspectRatio={aspectRatio}
            width={cardWidth}
            onPress={() => onPressItem(item)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three },
});
