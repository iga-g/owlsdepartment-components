import { observeIntersections, Unobserve } from '@ovee.js/toolkit/tools';
import { ClassConstructor, Component } from 'ovee.js';

const DEFAULT_THRESHOLD = [0, 1];

export interface IWithInViewport {
	unobserve?: Unobserve;

	get observerOptions(): IntersectionObserverInit;

	onIntersection(entry: IntersectionObserverEntry): void;
}

export function WithInViewport<Base extends ClassConstructor<Component>>(
	Ctor: Base
): ClassConstructor<IWithInViewport> & Base {
	class _WithInViewport extends Ctor implements IWithInViewport {
		unobserve?: Unobserve;

		get observerOptions(): IntersectionObserverInit {
			return {
				threshold: WithInViewport.config.threshold,
			};
		}

		init() {
			super.init();

			this.unobserve = observeIntersections(
				this.$element,
				entry => {
					this.onIntersection(entry);
				},
				this.observerOptions
			);
		}

		destroy() {
			this.unobserve?.();

			super.destroy();
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onIntersection(entry: IntersectionObserverEntry) {
			//
		}
	}

	return _WithInViewport;
}

WithInViewport.config = {
	threshold: DEFAULT_THRESHOLD as number | number[],
};
