async function log(isMobile, profile, score) {
    let data = {
        isMobile: isMobile
    };

    let response = await fetch('/random-block-puzzle/log-process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    let result = await response.json();
    console.log(result, typeof(result));
}

// export { log };