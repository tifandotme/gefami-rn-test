import React, { useState, useEffect } from "react"
import { useColorScheme } from "nativewind"
import { SunIcon, MoonIcon } from "@/components/ui/icon"
import * as SecureStore from "expo-secure-store"
import { KeyboardAvoidingView, Platform, View } from "react-native"
import { Center } from "@/components/ui/center"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Divider } from "@/components/ui/divider"
import { Input, InputField } from "@/components/ui/input"
import { Button, ButtonText } from "@/components/ui/button"
import { Alert, AlertText } from "@/components/ui/alert"

export default function Tab1() {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUsername, setLoggedInUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUsername = await SecureStore.getItemAsync("username")
        if (storedUsername) {
          setIsLoggedIn(true)
          setLoggedInUsername(storedUsername)
        }
      } catch (err) {
        console.error("Error checking login status:", err)
      }
    }

    checkLoginStatus()
  }, [])

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would validate credentials against a backend
      // For this example, we'll just store the username and password
      await SecureStore.setItemAsync("username", username)
      await SecureStore.setItemAsync("password", password)

      // Set login state
      setIsLoggedIn(true)
      setLoggedInUsername(username)

      // Clear input fields
      setUsername("")
      setPassword("")
    } catch (err) {
      console.error("Error logging in:", err)
      setError("Failed to log in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Clear stored credentials
      await SecureStore.deleteItemAsync("username")
      await SecureStore.deleteItemAsync("password")

      // Reset state
      setIsLoggedIn(false)
      setLoggedInUsername("")
    } catch (err) {
      console.error("Error logging out:", err)
      setError("Failed to log out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Center className="flex-1 p-4">
        <Box className="w-full max-w-md p-6 rounded-lg bg-background-50 shadow-lg">
          <Heading className="text-2xl font-bold text-center mb-6">
            {isLoggedIn ? "User Dashboard" : "Login"}
          </Heading>

          {error && (
            <Alert action="error" className="mb-4">
              <AlertText>{error}</AlertText>
            </Alert>
          )}

          {
            isLoggedIn ?
              // Logged in state - show welcome message and logout button
              <View className="items-center">
                <Text className="text-lg mb-8 text-center">
                  Selamat datang,{" "}
                  <Text className="font-bold">{loggedInUsername}</Text>!
                </Text>

                <Button
                  action="negative"
                  variant="outline"
                  onPress={handleLogout}
                  isDisabled={isLoading}
                  className="w-full"
                >
                  <ButtonText>
                    {isLoading ? "Logging Out..." : "Logout"}
                  </ButtonText>
                </Button>
              </View>
              // Logged out state - show login form
            : <View>
                <Input variant="outline" className="mb-4">
                  <InputField
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </Input>

                <Input variant="outline" className="mb-6">
                  <InputField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </Input>

                <Button
                  action="primary"
                  onPress={handleLogin}
                  isDisabled={isLoading}
                  className="w-full"
                >
                  <ButtonText>
                    {isLoading ? "Logging In..." : "Login"}
                  </ButtonText>
                </Button>
              </View>

          }
        </Box>
      </Center>
    </KeyboardAvoidingView>
  )
}
