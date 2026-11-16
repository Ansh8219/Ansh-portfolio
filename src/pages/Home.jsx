import { memo } from 'react'
import HeroAtlas from '../components/atlas/HeroAtlas'
import StoryAtlas from '../components/atlas/StoryAtlas'
import ServicesAtlas from '../components/atlas/ServicesAtlas'
import WorkAtlas from '../components/atlas/WorkAtlas'
import OneTeamAtlas from '../components/atlas/OneTeamAtlas'
import ResumeAtlas from '../components/atlas/ResumeAtlas'

/**
 * Home (Engineered Atlas direction).
 * hero → who we are → services (pinned) → work (pinned stage) → one team. The footer is the contact section (id="contact" on this page).
 * The WebGL vault object lives in <VaultStage/> (App level) and is driven by these sections' scroll.
 */
const Home = () => (
  <div className="page-root at-page" data-page="home">
    <HeroAtlas />
    <StoryAtlas />
    <ServicesAtlas />
    <WorkAtlas />
    <ResumeAtlas />
    <OneTeamAtlas />
  </div>
)

export default memo(Home)
