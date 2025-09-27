import { useState } from 'react';
import type { ProjectFormData, ProjectFormErrors } from '../types/project.types';
import { DEFAULT_FORM_DATA } from '../constants/project.constants';

export const useProjectForm = () => {
  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProjectFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên dự án là bắt buộc';
    }
    
    if (!formData.target_product_name.trim()) {
      newErrors.target_product_name = 'Tên sản phẩm mục tiêu là bắt buộc';
    }

    if (formData.target_budget_range && isNaN(Number(formData.target_budget_range))) {
      newErrors.target_budget_range = 'Ngân sách phải là số';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // TODO: Replace with actual API call
      alert('Dự án đã được tạo thành công!');
    } catch (_error) {
      alert('Có lỗi xảy ra khi tạo dự án');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: Replace with actual API call
      alert('Đã lưu bản nháp!');
    } catch (_error) {
      alert('Có lỗi xảy ra khi lưu bản nháp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    validateForm,
    handleSubmit,
    handleSaveDraft,
    resetForm,
  };
};