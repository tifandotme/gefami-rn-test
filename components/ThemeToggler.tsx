import React from "react";
import { Pressable } from "@/components/ui/pressable";
import { useColorScheme } from "nativewind";
import { SunIcon, MoonIcon, Icon } from "@/components/ui/icon";

export function ThemeToggler() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable onPress={toggleColorScheme} className="p-2 rounded-full mr-2">
      {colorScheme === "dark" ? (
        <Icon as={MoonIcon} className="text-primary-500" />
      ) : (
        <Icon as={SunIcon} className="text-primary-500" />
      )}
    </Pressable>
  );
}
