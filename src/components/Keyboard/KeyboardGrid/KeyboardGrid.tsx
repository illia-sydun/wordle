import { ElementRef, useRef } from 'react';
import styles from './KeyboardGrid.module.scss';
import { KeyboardGridCell } from './KeyboardGridCell';
import type { KeyboardKey } from '@shared/types/KeyboardKey.ts';
import type { KeyboardLayout } from '../Keyboard.types.ts';
import { useKeyPress } from '@shared/hooks/useKeyPress.ts';

type KeyboardGridProps = {
    keyboardLayout: KeyboardLayout;
    onKeyboardKeyPress: (keyboardKey: KeyboardKey) => void;
};

export const KeyboardGrid = ({
    keyboardLayout,
    onKeyboardKeyPress,
}: KeyboardGridProps) => {
    // @TODO why
    const flatKeyboardLayout = keyboardLayout.flat();
    const ref = useRef<ElementRef<'div'>>(null);

    // @TODO use hook?
    const handleAnimateKeyboardGridCellClick = (keyboardKey: KeyboardKey) => {
        const keyboardGridCell = ref.current?.querySelector(
            `[data-value='${keyboardKey}']`,
        );

        if (keyboardGridCell instanceof HTMLButtonElement) {
            keyboardGridCell.setAttribute('data-is-animated', 'true');
            keyboardGridCell.click();
            setTimeout(() => {
                keyboardGridCell.setAttribute('data-is-animated', 'false');
            }, 250);
        }
    };

    // @TODO it doesn't look good
    useKeyPress((event, keyboardKey) => {
        if (event.target instanceof HTMLBodyElement) {
            handleAnimateKeyboardGridCellClick(keyboardKey);
        }
        if (event.target instanceof HTMLButtonElement) {
            const keyboardKey = event.target.getAttribute('data-value');
            if (keyboardKey) {
                event.preventDefault();
                handleAnimateKeyboardGridCellClick(keyboardKey as KeyboardKey);
            }
        }
    }, flatKeyboardLayout);

    // @TODO flattening keyboardLayout doesn't look good
    return (
        <div className={styles.container} ref={ref}>
            {flatKeyboardLayout.map((key) => (
                <KeyboardGridCell
                    key={key}
                    value={key}
                    onClick={onKeyboardKeyPress}
                    status={'empty'}
                />
            ))}
        </div>
    );
};
