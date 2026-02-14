import Modal from '@/components/Modal/Modal';
import Book from '@/components/Book/Book';
import { Suspense } from 'react';

export default function BookModalPage() {
  return (
    <Modal>
      <Suspense fallback={null}>
        <Book />
      </Suspense>
    </Modal>
  );
}
