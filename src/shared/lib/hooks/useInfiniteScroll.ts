import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";

export interface UseInfiniteScrollOptions {
	callback?: () => void;
	triggerRef: MutableRefObject<HTMLElement | null>;
	wrapperRef?: MutableRefObject<HTMLElement | null>;
}

export function useInfiniteScroll({
									  callback,
									  wrapperRef,
									  triggerRef,
								  }: UseInfiniteScrollOptions) {
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const wrapperElement = wrapperRef?.current || null;
		const triggerElement = triggerRef.current;

		console.log('useInfiniteScroll setup:', {
			hasWrapper: !!wrapperElement,
			hasTrigger: !!triggerElement,
			hasCallback: !!callback
		});

		if (callback && triggerElement) {
			const options = {
				root: wrapperElement,
				rootMargin: "20px", // Добавьте rootMargin для более раннего срабатывания
				threshold: 0.1, // Увеличьте threshold
			};

			observer.current = new IntersectionObserver(([entry]) => {
				console.log('Intersection observed:', {
					isIntersecting: entry.isIntersecting,
					intersectionRatio: entry.intersectionRatio,
					boundingClientRect: entry.boundingClientRect
				});

				if (entry.isIntersecting) {
					console.log('Calling callback from IntersectionObserver');
					callback();
				}
			}, options);

			observer.current.observe(triggerElement);
		}

		return () => {
			if (observer.current && triggerElement) {
				observer.current.unobserve(triggerElement);
			}
		};
	}, [callback, triggerRef, wrapperRef]);
}