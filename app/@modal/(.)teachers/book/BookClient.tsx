'use client';

import Modal from '@/components/Modal/Modal';
import dynamic from 'next/dynamic';

const Book = dynamic(() => import('@/components/Book/Book'), { ssr: false });

export default function BookClient() {
  return (
    <Modal>
      <Book />
    </Modal>
  );
}
