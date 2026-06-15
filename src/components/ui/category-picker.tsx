import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface CategoryOption {
  id: string | undefined;
  label: string;
}

export function CategoryPicker({
  options,
  selectedId,
  onSelect,
}: {
  options: CategoryOption[];
  selectedId: string | undefined;
  onSelect: (id: string | undefined) => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedLabel = options.find((o) => o.id === selectedId)?.label ?? 'Todos';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const pick = (id: string | undefined) => {
    onSelect(id);
    close();
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Ionicons name="filter" size={16} color={theme.accent} />
        <ThemedText type="small" style={[styles.triggerLabel, { fontFamily: Fonts.semibold }]} numberOfLines={1}>
          {selectedLabel}
        </ThemedText>
        <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={[styles.sheet, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
            <View style={styles.header}>
              <ThemedText type="subtitle">Categorías</ThemedText>
              <Pressable onPress={close} hitSlop={12}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>

            <View style={[styles.search, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Ionicons name="search" size={18} color={theme.textSecondary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar categoría"
                placeholderTextColor={theme.textSecondary}
                autoCorrect={false}
                style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.regular }]}
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(o) => o.id ?? 'all'}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const active = item.id === selectedId;
                return (
                  <Pressable
                    onPress={() => pick(item.id)}
                    style={[styles.option, active && { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText
                      style={{ color: active ? theme.accent : theme.text, fontFamily: active ? Fonts.semibold : Fonts.regular }}
                      numberOfLines={1}>
                      {item.label}
                    </ThemedText>
                    {active ? <Ionicons name="checkmark" size={20} color={theme.accent} /> : null}
                  </Pressable>
                );
              }}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
    maxWidth: 260,
  },
  triggerLabel: { flexShrink: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sheetInner: { flex: 1, paddingHorizontal: Spacing.three, paddingTop: Spacing.three },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.three,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.two,
  },
  searchInput: { flex: 1, paddingVertical: Spacing.three, fontSize: 15 },
  list: { flex: 1 },
  listContent: { paddingBottom: Spacing.six },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: 10,
  },
});
