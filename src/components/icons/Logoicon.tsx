


function Logoicon() {
    return (
        <svg viewBox="0 0 100 100" width="32" height="32">
            {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                return (
                    <rect
                        key={i}
                        x="45"
                        y={70}
                        width="10"
                        height="20"
                        transform={`rotate(${angle} 50 50)`}
                        fill="#367AFF"

                    />
                );
            })}
        </svg>
    )
}

export default Logoicon