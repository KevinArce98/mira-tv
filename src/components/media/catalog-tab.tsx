import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContentGrid } from '@/components/media/content-grid';
import { ThemedView } from '@/components/themed-view';
import { CategoryPicker } from '@/components/ui/category-picker';
import { Empty, Loading } from '@/components/ui/empty';
import { ScreenTitle } from '@/components/ui/screen-title';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAccount } from '@/hooks/data/use-account';
import { useCatalog, useCategories } from '@/hooks/data/use-catalog';
import { openContent } from '@/lib/navigation';
import type { ContentType } from '@/types/models';

export function CatalogTab({ tipo, title }: { tipo: ContentType; title: string }) {
  const { data: account } = useAccount();
  const accountId = account?.id;

  const [categoriaId, setCategoriaId] = useState<string | undefined>(undefined);
  const categories = useCategories(accountId, tipo);
  const catalog = useCatalog(accountId, tipo, categoriaId);

  const options = [
    { id: undefined as string | undefined, label: 'Todas' },
    ...(categories.data ?? []).map((c) => ({ id: c.categoria_id ?? undefined, label: c.categoria ?? 'Sin categoría' })),
  ];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScreenTitle title={title} />

        <View style={styles.pickerWrap}>
          <CategoryPicker options={options} selectedId={categoriaId} onSelect={setCategoriaId} />
        </View>

        {catalog.isLoading ? (
          <Loading />
        ) : (
          <ContentGrid
            items={catalog.data ?? []}
            onPressItem={openContent}
            contentInsetBottom={BottomTabInset}
            ListEmptyComponent={
              catalog.isError ? (
                <Empty
                  icon="cloud-offline-outline"
                  title="No se pudo cargar"
                  subtitle="Revisa tu conexión e inténtalo de nuevo."
                />
              ) : (
                <Empty
                  icon="film-outline"
                  title="Catálogo vacío"
                  subtitle="Desliza hacia abajo en Inicio para sincronizar, o revisa tu cuenta."
                />
              )
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  pickerWrap: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
});
