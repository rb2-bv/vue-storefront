/* istanbul ignore file */

import {
  AgnosticProductReview
} from '@vue-storefront/core';
import { Review } from '../../types';
import { ReviewGetters } from '../useReviews';

export const getReviewInfo = (review: Review): AgnosticProductReview => ({
  id: review!.id!,
  author: review.nickname || "",
  message: review.detail || "",
  rating: review.score || 0,
  date: new Date(review.createdAt || "")
});
const reviewGetters: ReviewGetters<Review> = {
  getReviewInfo: getReviewInfo
};

export default reviewGetters;
