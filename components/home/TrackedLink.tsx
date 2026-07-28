'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { analyticsEvents } from '@/lib/analytics';

interface TrackedLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  trackAction?: string;
  trackCategory?: string;
  trackLabel?: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

export default function TrackedLink({
  href,
  trackAction,
  trackCategory,
  trackLabel,
  children,
  isExternal,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (analyticsEvents?.trackEvent && trackAction && trackCategory && trackLabel) {
      analyticsEvents.trackEvent(trackAction, trackCategory, trackLabel);
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  if (isExternal || (typeof href === 'string' && href.startsWith('#'))) {
    return (
      <a href={href.toString()} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
