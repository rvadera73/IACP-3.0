import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActionMenu, { ActionItems } from '../components/UI/ActionMenu';
import { render, screen, fireEvent } from '@testing-library/react';

describe('ActionMenu', () => {
  const mockItems = [
    {
      id: 'view',
      label: 'View',
      onClick: vi.fn(),
    },
    {
      id: 'edit',
      label: 'Edit',
      onClick: vi.fn(),
      variant: 'primary' as const,
    },
    {
      id: 'delete',
      label: 'Delete',
      onClick: vi.fn(),
      variant: 'error' as const,
    },
  ];

  const mockContextInfo = [
    { label: 'Status:', value: 'Active' },
    { label: 'Priority:', value: 'High' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render trigger button', () => {
    render(<ActionMenu items={mockItems} />);
    
    const triggerButton = screen.getByText('Actions');
    expect(triggerButton).toBeInTheDocument();
  });

  it('should render with custom default action', () => {
    const customAction = {
      id: 'custom',
      label: 'Custom Action',
      icon: <span>Icon</span>,
      onClick: vi.fn(),
    };

    render(<ActionMenu items={mockItems} defaultAction={customAction} />);
    
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('should open menu on hover', async () => {
    render(<ActionMenu items={mockItems} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    expect(menuContainer).toBeInTheDocument();
    
    // Hover to open
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      
      // Wait for menu to appear
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check if menu items are visible
      expect(screen.getByText('View')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    }
  });

  it('should close menu on mouse leave', async () => {
    render(<ActionMenu items={mockItems} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      // Hover to open
      fireEvent.mouseEnter(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify menu is open
      expect(screen.getByText('View')).toBeInTheDocument();
      
      // Mouse leave
      fireEvent.mouseLeave(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Menu should be closed - check for the dropdown container
      const dropdown = screen.queryByRole('menu');
      expect(dropdown).not.toBeInTheDocument();
    }
  });

  it('should call onClick when menu item is clicked', async () => {
    render(<ActionMenu items={mockItems} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const viewButton = screen.getByText('View');
      fireEvent.click(viewButton);
      
      expect(mockItems[0].onClick).toHaveBeenCalled();
    }
  });

  it('should not call onClick when disabled item is clicked', async () => {
    const disabledItems = [
      {
        id: 'disabled',
        label: 'Disabled',
        onClick: vi.fn(),
        disabled: true,
      },
    ];

    render(<ActionMenu items={disabledItems} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const disabledButton = screen.getByText('Disabled');
      fireEvent.click(disabledButton);
      
      expect(disabledItems[0].onClick).not.toHaveBeenCalled();
    }
  });

  it('should render context info panel', async () => {
    render(<ActionMenu items={mockItems} contextInfo={mockContextInfo} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByText('Priority:')).toBeInTheDocument();
    }
  });

  it('should filter items based on condition', () => {
    const conditionalItems = [
      {
        id: 'always-show',
        label: 'Always Show',
        onClick: vi.fn(),
        condition: true,
      },
      {
        id: 'never-show',
        label: 'Never Show',
        onClick: vi.fn(),
        condition: false,
      },
    ];

    render(<ActionMenu items={conditionalItems} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      
      expect(screen.getByText('Always Show')).toBeInTheDocument();
      expect(screen.queryByText('Never Show')).not.toBeInTheDocument();
    }
  });

  it('should apply correct variant styles', async () => {
    const variantItems = [
      { id: 'default', label: 'Default', onClick: vi.fn(), variant: 'default' as const },
      { id: 'primary', label: 'Primary', onClick: vi.fn(), variant: 'primary' as const },
      { id: 'success', label: 'Success', onClick: vi.fn(), variant: 'success' as const },
      { id: 'warning', label: 'Warning', onClick: vi.fn(), variant: 'warning' as const },
      { id: 'error', label: 'Error', onClick: vi.fn(), variant: 'error' as const },
    ];

    render(<ActionMenu items={variantItems} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(screen.getByText('Default')).toBeInTheDocument();
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    }
  });

  it('should respect dividerAfter property', async () => {
    const itemsWithDivider = [
      { id: 'first', label: 'First', onClick: vi.fn(), dividerAfter: true },
      { id: 'second', label: 'Second', onClick: vi.fn() },
    ];

    render(<ActionMenu items={itemsWithDivider} />);
    
    const menuContainer = screen.getByText('Actions').closest('.relative');
    
    if (menuContainer) {
      fireEvent.mouseEnter(menuContainer);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Divider should be present after first item (check for border-t class)
      const divider = screen.getByTestId('divider') || menuContainer.querySelector('.border-t');
      expect(divider).toBeInTheDocument();
    }
  });
});

describe('ActionItems', () => {
  const mockOnClick = vi.fn();

  it('should create viewCase action item', () => {
    const action = ActionItems.viewCase(mockOnClick);
    
    expect(action.id).toBe('view-case');
    expect(action.label).toBe('View Case');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('default');
  });

  it('should create autoDocket action item', () => {
    const action = ActionItems.autoDocket(mockOnClick);
    
    expect(action.id).toBe('auto-docket');
    expect(action.label).toBe('Auto-Docket');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('success');
  });

  it('should create sendDeficiency action item', () => {
    const action = ActionItems.sendDeficiency(mockOnClick);
    
    expect(action.id).toBe('send-deficiency');
    expect(action.label).toBe('Send Deficiency Notice');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('warning');
  });

  it('should create assignToJudge action item', () => {
    const action = ActionItems.assignToJudge(mockOnClick);
    
    expect(action.id).toBe('assign-judge');
    expect(action.label).toBe('Assign to Judge');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('primary');
  });

  it('should create scheduleHearing action item', () => {
    const action = ActionItems.scheduleHearing(mockOnClick);
    
    expect(action.id).toBe('schedule-hearing');
    expect(action.label).toBe('Schedule Hearing');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('success');
  });

  it('should create editDraft action item', () => {
    const action = ActionItems.editDraft(mockOnClick);
    
    expect(action.id).toBe('edit-draft');
    expect(action.label).toBe('Edit Draft');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('primary');
  });

  it('should create signRelease action item', () => {
    const action = ActionItems.signRelease(mockOnClick);
    
    expect(action.id).toBe('sign-release');
    expect(action.label).toBe('Sign & Release');
    expect(action.onClick).toBe(mockOnClick);
    expect(action.variant).toBe('success');
  });
});
