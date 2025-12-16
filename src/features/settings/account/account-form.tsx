import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getMyProfile, updateMyProfile } from '@/apis/user.api'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const accountFormSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not be longer than 100 characters.'),
  date_of_birth: z.date().nullable().optional(),
  language: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const queryClient = useQueryClient()
  
  // Load user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => getMyProfile(),
  })

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      full_name: '',
      date_of_birth: undefined,
      language: 'en',
    },
  })

  // Update form when user data loads - using useEffect to avoid infinite loop
  useEffect(() => {
    if (userData?.data && !isLoading) {
      const user = userData.data
      form.reset({
        full_name: user.full_name || '',
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : undefined,
        language: user.language || 'en',
      })
    }
  }, [userData?.data, isLoading, form])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: AccountFormValues) => updateMyProfile({
      full_name: data.full_name,
      date_of_birth: data.date_of_birth ? data.date_of_birth.toISOString().split('T')[0] : null,
      language: data.language || undefined,
    }),
    onSuccess: () => {
      toast.success('Account updated successfully')
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to update account')
    },
  })

  function onSubmit(data: AccountFormValues) {
    updateMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your name' {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date_of_birth'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Date of birth</FormLabel>
              <DatePicker 
                selected={field.value || undefined} 
                onSelect={field.onChange}
                disabled={isLoading}
              />
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : 'Select language'}
                      <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput placeholder='Search language...' />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading || updateMutation.isPending}>
          {updateMutation.isPending ? 'Updating...' : 'Update account'}
        </Button>
      </form>
    </Form>
  )
}
