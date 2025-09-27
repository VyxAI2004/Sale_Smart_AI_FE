import { useProjectForm } from './hooks/use-project-form';
import {
  ProjectDetailsCard,
  BudgetCard,
  ConfigurationCard,
  SidebarCards,
  ProjectPreviewCard,
  ProductImagesCard,
  // AIModelCard,
  // TeamAssignmentCard,
} from './components';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ConfigDrawer } from '@/components/config-drawer';
import { Button } from '@/components/ui/button';

const AddProjectForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    handleSaveDraft,
    resetForm,
  } = useProjectForm();

  const handleDiscard = () => {
    resetForm();
  };

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Add Project</h2>
            <p className='text-muted-foreground'>
              Create a new project to track and analyze market trends.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-6"
            >
              Save Draft
            </Button>
            <Button 
              variant="outline" 
              className="px-6 text-muted-foreground hover:text-foreground"
              onClick={handleDiscard}
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ProjectDetailsCard
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <ProductImagesCard
                images={formData.product_images || []}
                onImagesChange={(images) => handleInputChange('product_images', images)}
              />

              <BudgetCard
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <ConfigurationCard
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Test AI Model Card only */}
              {/* <AIModelCard
                formData={formData}
                onInputChange={handleInputChange}
              /> */}

              {/* Test Team Assignment Card only */}
              {/* <TeamAssignmentCard
                formData={formData}
                onInputChange={handleInputChange}
              /> */}

              <SidebarCards
                formData={formData}
                onInputChange={handleInputChange}
              />

              <ProjectPreviewCard formData={formData} />
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

export default AddProjectForm;