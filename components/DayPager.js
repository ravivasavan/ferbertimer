import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Platform } from 'react-native';
import TimerScreen from './TimerScreen';

const { width } = Dimensions.get('window');

export default function DayPager({ currentDay, onDayChange }) {
  const flatListRef = useRef(null);
  const [widthState, setWidthState] = useState(width);

  // Days 1 through 8 (where 8 represents 8+)
  const days = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    // Scroll to the current day when component mounts or currentDay changes externally
    if (flatListRef.current && currentDay >= 1 && currentDay <= 8) {
        flatListRef.current.scrollToIndex({ index: currentDay - 1, animated: true });
    }
  }, [currentDay]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / widthState);
    const newDay = index + 1;
    if (newDay !== currentDay && newDay >= 1 && newDay <= 8) {
      onDayChange(newDay);
    }
  };

  const getItemLayout = (_, index) => ({
    length: widthState,
    offset: widthState * index,
    index,
  });

  const renderItem = ({ item }) => {
    return (
      <View style={{ width: widthState, flex: 1 }}>
        <TimerScreen
          day={item}
          currentDay={currentDay}
          onDayChange={onDayChange}
        />
      </View>
    );
  };

  return (
    <View 
      style={styles.container} 
      onLayout={(e) => setWidthState(e.nativeEvent.layout.width)}
    >
      <FlatList
        ref={flatListRef}
        data={days}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={getItemLayout}
        initialScrollIndex={currentDay > 0 ? currentDay - 1 : 0}
        accessibilityLabel="Days 1 to 8, swipe left or right to change day"
        accessibilityRole="list"
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
        decelerationRate="fast"
        snapToInterval={widthState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
