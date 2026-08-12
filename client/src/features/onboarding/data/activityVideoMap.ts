import calisthenicsVideo from '../../../assets/onBoardingvid/10477144-uhd_4096_2160_25fps.mp4';
import muayThaiVideo from '../../../assets/onBoardingvid/5752167-uhd_3840_2160_25fps.mp4';
import crossfitVideo from '../../../assets/onBoardingvid/7673611-uhd_2160_4096_25fps.mp4';
import swimmingVideo from '../../../assets/onBoardingvid/8686046-hd_1920_1080_30fps.mp4';
import tennisVideo from '../../../assets/onBoardingvid/Tennis.mp4';

/**
 * Maps an activity id (see activities.ts) to a background video source.
 *
 * Only a handful of activities have footage today. Every other activity
 * is left unset so StepVideoBackground falls back to a neutral placeholder —
 * add more entries here as more clips become available.
 */
export const ACTIVITY_VIDEO_MAP: Partial<Record<string, string>> = {
  calisthenics: calisthenicsVideo,
  muay_thai: muayThaiVideo,
  crossfit: crossfitVideo,
  swimming: swimmingVideo,
  tennis: tennisVideo,
};
