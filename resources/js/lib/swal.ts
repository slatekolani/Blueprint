import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
});

export const successToast = (message: string) =>
    Toast.fire({ icon: 'success', title: message });

export const confirmDelete = (itemName?: string): Promise<boolean> =>
    Swal.fire({
        title: 'Are you sure?',
        text: itemName
            ? `"${itemName}" will be permanently deleted. This cannot be undone.`
            : 'This will be permanently deleted. This cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
    }).then(r => r.isConfirmed);

export const confirmSave = (action = 'save these changes'): Promise<boolean> =>
    Swal.fire({
        title: 'Save changes?',
        text: `Are you sure you want to ${action}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1d4ed8',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, save',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
    }).then(r => r.isConfirmed);
