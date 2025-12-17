import { useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getMyProfile, updateMyProfile } from '@/apis/user.api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
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

export function ProfileForm() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const profileFormSchema = z.object({
    full_name: z
      .string()
      .min(1, t('account.validation.nameRequired'))
      .min(2, t('account.validation.nameMinLength'))
      .max(100, t('account.validation.nameMaxLength')),
    username: z
      .string()
      .min(2, t('account.validation.usernameMinLength'))
      .max(50, t('account.validation.usernameMaxLength')),
    email: z.string().email(t('account.validation.emailInvalid')),
    date_of_birth: z.date().nullable().optional(),
    language: z.string().optional(),
    bio: z.string().max(500).min(0).optional(),
    urls: z
      .array(
        z.object({
          value: z
            .string()
            .url(t('account.validation.urlInvalid'))
            .or(z.literal('')),
        })
      )
      .optional(),
  })

  type ProfileFormValues = z.infer<typeof profileFormSchema>

  // Load user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => getMyProfile(),
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      email: '',
      date_of_birth: undefined,
      language: 'en',
      bio: '',
      urls: [],
    },
    mode: 'onChange',
  })

  // Update form when user data loads - using useEffect to avoid infinite loop
  useEffect(() => {
    if (userData?.data && !isLoading) {
      const user = userData.data
      form.reset({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        date_of_birth: user.date_of_birth
          ? new Date(user.date_of_birth)
          : undefined,
        language: user.language || 'en',
        bio: user.bio || '',
        urls:
          user.urls && user.urls.length > 0
            ? user.urls.map((url) => ({ value: url }))
            : [],
      })
    }
  }, [userData?.data, isLoading, form])

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) =>
      updateMyProfile({
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        date_of_birth: data.date_of_birth
          ? data.date_of_birth.toISOString().split('T')[0]
          : null,
        language: data.language || undefined,
        bio: data.bio || undefined,
        urls:
          data.urls?.filter((url) => url.value).map((url) => url.value) ||
          undefined,
      }),
    onSuccess: () => {
      toast.success(t('account.updateSuccess'))
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || t('account.updateError'))
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))}
        className='space-y-8'
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('account.namePlaceholder')}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>{t('account.nameDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.username')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('account.usernamePlaceholder')}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {t('account.usernameDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.email')}</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder={t('account.emailPlaceholder')}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {t('account.emailDescription')}{' '}
                <Link to='/'>{t('account.emailSettings')}</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name='date_of_birth'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('account.dateOfBirth')}</FormLabel>
              <DatePicker
                selected={field.value || undefined}
                onSelect={field.onChange}
              />
              <FormDescription>
                {t('account.dateOfBirthDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language */}
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('account.language')}</FormLabel>
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
                        : t('account.selectLanguage')}
                      <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput placeholder={t('account.searchLanguage')} />
                    <CommandEmpty>{t('account.noLanguageFound')}</CommandEmpty>
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
                {t('account.languageDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.bio')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('account.bioPlaceholder')}
                  className='resize-none'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>{t('account.bioDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URLs */}
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    {t('account.urls')}
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    {t('account.urlsDescription')}
                  </FormDescription>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
            disabled={isLoading}
          >
            {t('account.addUrl')}
          </Button>
        </div>

        <Button type='submit' disabled={isLoading || updateMutation.isPending}>
          {updateMutation.isPending
            ? t('account.updating')
            : t('account.updateAccount')}
        </Button>
      </form>
    </Form>
  )
}
