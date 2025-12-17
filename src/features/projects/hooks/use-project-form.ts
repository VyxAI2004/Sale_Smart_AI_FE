import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { DEFAULT_FORM_DATA } from '../constants/project.constants'
import { ProjectService } from '../services/project-service'
import type { ProjectFormData, ProjectFormErrors } from '../types/project.types'

export const useProjectForm = () => {
  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<ProjectFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (field: keyof ProjectFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const validationErrors = ProjectService.validateProjectData(formData)

    const newErrors: ProjectFormErrors = {}
    validationErrors.forEach((error, index) => {
      if (error.includes('name')) {
        newErrors.name = error
      } else if (error.includes('product')) {
        newErrors.target_product_name = error
      } else if (error.includes('budget')) {
        newErrors.target_budget_range = error
      } else if (error.includes('assign')) {
        newErrors.assigned_to = error
      } else {
        // Generic error
        newErrors[`error_${index}`] = error
      }
    })

    setErrors(newErrors)
    return validationErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Create project via service (includes toast notifications)
      await ProjectService.createProject(formData)

      // Navigate to projects list or project detail
      navigate({ to: '/projects' })
    } catch (_error) {
      // Error handling is done in service layer
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)

    try {
      // Create draft project via service (includes toast notifications)
      await ProjectService.createDraftProject(formData)
    } catch (_error) {
      // Error handling is done in service layer
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setIsSubmitting(false)
  }

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    validateForm,
    handleSubmit,
    handleSaveDraft,
    resetForm,
  }
}
