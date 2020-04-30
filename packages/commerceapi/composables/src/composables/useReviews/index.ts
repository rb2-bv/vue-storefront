import { Ref, ref, computed, watch } from '@vue/composition-api';
import { AgnosticProductReview } from '@vue-storefront/core';
import { Review, catalogReviews } from '@vue-storefront/commerceapi-api';
import { ProductInfo } from '../../types';

// TODO: Contribute back top VSF this part
export interface ReviewData<REVIEWTYPE> {
    totalCount: number;
    reviews: REVIEWTYPE[];
}

export interface ReviewGetters<REVIEWTYPE> {
    getReviewInfo: (input: REVIEWTYPE) => AgnosticProductReview;
}

export class ReviewsData<PRODUCTTYPE, REVIEWTYPE> {
    constructor(loadReviews: (product: PRODUCTTYPE, page: number) => Promise<ReviewData<REVIEWTYPE>>){
        this.loadReviews = loadReviews;

        watch(this.activePage, () => {
            if (!this.changing) this.reload();
        });

        watch(this.activePage, () => {
            if (!this.changing) this.reload();
        });
    }
    private changing = false;
    private loading: Object | null = null;
    private loadReviews: (product: PRODUCTTYPE, page: number) => Promise<ReviewData<REVIEWTYPE>>;
    public totalCount = ref(0);
    public pageCount = computed(() => this.totalCount.value / 20 );
    public activePage = ref(1);
    public product: Ref<PRODUCTTYPE | null> = ref(null);
    public reviews: Ref<REVIEWTYPE[]> = ref([]);

    private async reload() {
        let loadingCheck = this.loading = new Object();
        if (!this.product.value) {
            return;
        }
        var response = await this.loadReviews(this.product.value!, this.activePage.value);
        // if the check mismatches we had multiple requests. Always return only the last one started.
        if (loadingCheck != this.loading) return;
        
        this.totalCount.value = response.totalCount;
        this.reviews.value = response.reviews;
    }

    public async loadProduct(val: PRODUCTTYPE) {
        this.changing = true;
        this.product.value = val;
        this.activePage.value = 1;
        this.totalCount.value = 0;

        await this.reload();
        this.changing = false;
    }
}

function useReviewsFactory<PRODUCTTYPE, REVIEWTYPE>(loadReviews: (product: PRODUCTTYPE, page: number) => Promise<ReviewData<REVIEWTYPE>>) {
    return function useReviews() { return new ReviewsData<PRODUCTTYPE, REVIEWTYPE>(loadReviews)};
}

// END OF TODO: contribute back top VSF this part
export default useReviewsFactory<ProductInfo, Review>(async(prod: ProductInfo, page: number): Promise<ReviewData<Review>> => {
    if (!prod?.id)
    return {
        totalCount: 0,
        reviews: []
    };
    var results = await catalogReviews({
        productId: prod.id,
        skip: (page-1) * 20,
        take: 20        
    });
    return {
        totalCount: results.total,
        reviews: results.items
    }
});
