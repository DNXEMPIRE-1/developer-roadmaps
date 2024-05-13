import {
  ChevronRight,
  LogOut,
  Map,
  Plus,
  SquareUserRound,
  User2,
  Users2,
  Handshake,
} from 'lucide-react';
import { logout } from './navigation';
import { CreateRoadmapModal } from '../CustomRoadmap/CreateRoadmap/CreateRoadmapModal.tsx';
import { useState } from 'react';
import { cn } from '../../lib/classname.ts';
import { NotificationIndicator } from './NotificationIndicator.tsx';
import { Spinner } from '../ReactIcons/Spinner.tsx';
import { CheckIcon } from '../ReactIcons/CheckIcon.tsx';

type AccountDropdownListProps = {
  onCreateRoadmap: () => void;
  setIsTeamsOpen: (isOpen: boolean) => void;
  onOnboardingClick: () => void;
  isConfigLoading: boolean;
  shouldShowOnboardingStatus?: boolean;
  onboardingConfigCount: number;
  doneConfigCount: number;
};

export function AccountDropdownList(props: AccountDropdownListProps) {
  const {
    setIsTeamsOpen,
    onCreateRoadmap,
    onOnboardingClick,
    isConfigLoading = true,
    shouldShowOnboardingStatus = false,
    onboardingConfigCount,
    doneConfigCount,
  } = props;

  return (
    <ul>
      {shouldShowOnboardingStatus && (
        <li className="mb-1 px-1">
          <button
            className={cn(
              'flex h-9 w-full items-center rounded py-1 pl-3 pr-2 text-sm font-medium text-slate-100 hover:opacity-80',
              isConfigLoading
                ? 'striped-loader-lighter flex border-slate-800 opacity-70'
                : 'border-slate-600 bg-slate-700',
            )}
            onClick={onOnboardingClick}
            disabled={isConfigLoading}
          >
            <NotificationIndicator className="-left-0.5 -top-0.5" />

            {isConfigLoading ? (
              <></>
            ) : (
              <>
                <Handshake className="mr-2 h-4 w-4 text-slate-400 group-hover:text-white" />
                <span>Onboarding</span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
                  {doneConfigCount} of {onboardingConfigCount}
                </span>
              </>
            )}
          </button>
        </li>
      )}
      <li className="px-1">
        <a
          href="/account"
          className="group flex items-center gap-2 rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <User2 className="h-4 w-4 stroke-[2.5px] text-slate-400 group-hover:text-white" />
          Account
        </a>
      </li>
      <li className="px-1">
        <a
          href="/account/update-profile"
          className="group flex items-center justify-between gap-2 rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <span className="flex items-center gap-2">
            <SquareUserRound className="h-4 w-4 stroke-[2.5px] text-slate-400 group-hover:text-white" />
            My Profile
          </span>
          <span className="rounded-sm bg-yellow-300 px-1 text-xs uppercase tracking-wide text-black">
            New
          </span>
        </a>
      </li>
      <li className="px-1">
        <a
          href="/account/friends"
          className="group flex items-center gap-2 rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <Users2 className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
          Friends
        </a>
      </li>
      <li className="mt-1 border-t border-t-gray-700/60 px-1 pt-1">
        <button
          onClick={() => {
            onCreateRoadmap();
          }}
          className="group flex w-full items-center gap-2 rounded py-2 pl-3 pr-2 text-left text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <Plus className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
          New Roadmap
        </button>
      </li>
      <li className="border-b border-b-gray-700/60 px-1 pb-1">
        <a
          href="/account/roadmaps"
          className="group flex items-center gap-2 rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <Map className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
          Roadmaps
        </a>
      </li>
      <li className="px-1 pt-1">
        <button
          className="group flex w-full items-center justify-between rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
          onClick={() => setIsTeamsOpen(true)}
        >
          <span className="flex items-center gap-2.5">
            <Users2 className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
            Teams
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 stroke-[2.5px] text-slate-400 group-hover:text-white" />
        </button>
      </li>
      <li className="px-1">
        <button
          className="group flex w-full items-center gap-2 rounded py-2 pl-3 pr-2 text-left text-sm font-medium text-slate-100 hover:bg-slate-700"
          type="button"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
          Logout
        </button>
      </li>
    </ul>
  );
}
