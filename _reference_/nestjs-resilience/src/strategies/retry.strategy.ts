import { Strategy } from './base.strategy';
import { Backoff, FixedBackoff } from '../helpers';
import { Observable, retry, timer } from 'rxjs';
import { RetryOptions } from '../interfaces';

export class RetryStrategy extends Strategy<RetryOptions> {
	private static readonly DEFAULT_OPTIONS: RetryOptions = {
		maxRetries: 5,
		maxDelay: 30000,
		scaleFactor: 1,
		backoff: FixedBackoff,
		retryable: () => true
	};

	private get backoff(): Backoff {
		if (this.options.backoff instanceof Backoff) {
			return this.options.backoff;
		}

		return new this.options.backoff();
	}

	public constructor(options: RetryOptions = {}) {
		super({ ...RetryStrategy.DEFAULT_OPTIONS, ...options });

		if (this.options.scaleFactor <= 0) {
			throw new RangeError(
				'Scale factor must be greater than 0, got: ' + this.options.scaleFactor
			);
		}
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		const generator = this.backoff.getGenerator(this.options.maxRetries);

		return observable.pipe(
			retry({
				count: this.options.maxRetries,
				delay: error => {
					if (!this.options.retryable(error)) {
						throw error;
					}

					const { value, done } = generator.next();

					if (done) {
						throw error;
					}

					const delay = value * this.options.scaleFactor;
					return timer(Math.max(0, Math.min(delay, this.options.maxDelay)));
				}
			})
		);
	}
}
