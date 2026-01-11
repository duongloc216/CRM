/**
 * Fix UTF-8 encoding issues from SQL Server
 * SQL Server + mssql driver issue: data comes back with wrong encoding
 */

export function fixEncoding(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    try {
      // SQL Server stores UTF-8 correctly but mssql driver reads it wrong
      // Convert from incorrectly decoded Latin-1 back to UTF-8
      const buffer = Buffer.from(obj, 'latin1');
      return buffer.toString('utf8');
    } catch (e) {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(item => fixEncoding(item));
  }

  if (typeof obj === 'object') {
    const fixed: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        fixed[key] = fixEncoding(obj[key]);
      }
    }
    return fixed;
  }

  return obj;
}
