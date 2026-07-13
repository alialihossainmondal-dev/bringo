export default async function handler(req, res) {
    // শুধু POST রিকোয়েস্ট অ্যালাউ করা হবে
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { orderId, status } = req.body;

    if (!orderId || !status) {
        return res.status(400).json({ message: 'Missing orderId or status' });
    }

    // আপনার Firebase প্রজেক্ট আইডি (bringo-f6d36) ব্যবহার করে সরাসরি ডাটাবেস আপডেট
    const projectId = 'bringo-f6d36';
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/orders/${orderId}?updateMask.fieldPaths=status`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    status: { stringValue: status }
                }
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true, message: 'Database updated successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Firebase error' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
