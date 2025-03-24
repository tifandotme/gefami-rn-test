import React, { useEffect } from "react"
import { ScrollView } from "react-native"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import EditScreenInfo from "@/components/EditScreenInfo"
import { Center } from "@/components/ui/center"
import { Divider } from "@/components/ui/divider"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button, ButtonText } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableData,
} from "@/components/ui/table"
import { Alert, AlertText } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import * as Crypto from "expo-crypto"

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

// Function to hash string using SHA-256
const hashWithSHA256 = async (input: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    input,
  )
  return digest
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts")
  const data = await response.json()
  return data.slice(0, 10)
}

export default function Tab2() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const generateHash = async () => {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, "0")
      const month = String(today.getMonth() + 1).padStart(2, "0") // +1 because months are 0-indexed
      const year = today.getFullYear()
      const dateString = `${day}${month}${year}`

      const firstName = "Tifan"

      const inputString = `${dateString}${firstName}priaifabula`

      console.log("Input string for hashing:", inputString)

      const hash = await hashWithSHA256(inputString)
      console.log("SHA-256 Hash result:", hash)
    }

    generateHash()
  }, [])

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    select: (data) => {
      return data.map(({ body, ...rest }: Post) => rest)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => {
      return Promise.resolve(postId)
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["posts"], (oldData: any) => {
        const filteredPosts = oldData.filter(
          (post: Post) => post.id !== deletedId,
        )
        return filteredPosts
      })
    },
  })

  const handleDeletePost = (id: number) => {
    deleteMutation.mutate(id)
  }

  return (
    <ScrollView>
      <Center className="flex-1 p-4">
        <Heading className="font-bold text-2xl mb-4">API Data Demo</Heading>
        <Divider className="my-4 w-full" />

        {error ?
          <Alert action="error" className="mb-4">
            <AlertText>{String(error)}</AlertText>
          </Alert>
        : null}

        {isLoading ?
          <Center className="p-8">
            <Spinner size="large" />
            <Text className="mt-4">Loading data...</Text>
          </Center>
        : <>
            <Text className="p-4 mb-2">
              Showing {posts?.length || 0} posts from JSONPlaceholder API
            </Text>

            <ScrollView horizontal className="mb-4">
              <Table className="border border-outline-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post: any) => (
                    <TableRow key={post.id}>
                      <TableData>{post.id}</TableData>
                      <TableData>{post.userId}</TableData>
                      <TableData>{post.title}</TableData>
                      <TableData>
                        <Button
                          action="negative"
                          variant="outline"
                          size="sm"
                          onPress={() => handleDeletePost(post.id)}
                          isDisabled={deleteMutation.isPending}
                        >
                          <ButtonText>
                            {(
                              deleteMutation.isPending &&
                              deleteMutation.variables === post.id
                            ) ?
                              "Deleting..."
                            : "Delete"}
                          </ButtonText>
                        </Button>
                      </TableData>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollView>

            <Text className="italic text-sm text-typography-500 mt-2">
              Note: The 'body' field has been removed from each post object
            </Text>
          </>
        }
      </Center>
    </ScrollView>
  )
}
